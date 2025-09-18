import { GoogleGenAI } from "@google/genai";
import type { Decision, SearchResponse } from '../types';

/**
 * yargi-mcp sunucusunun çalışıp çalışmadığını kontrol eder.
 * @returns Sunucu sağlıklıysa true, değilse false döner.
 */
export const checkMCPConnection = async (): Promise<boolean> => {
    try {
        const response = await fetch('http://localhost:8000/health', {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            signal: AbortSignal.timeout(3000),
        });
        if (response.ok) {
            const data = await response.json();
            return data.status === 'healthy';
        }
        return false;
    } catch (error) {
        console.warn("MCP bağlantı kontrolü başarısız:", error);
        return false;
    }
};

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// Helper to call MCP tools
const callMCPTool = async (tool: string, args: Record<string, any>) => {
    console.log(`MCP sunucusuna istek gönderiliyor: tool='${tool}', args=`, args);
    const endpoint = 'http://localhost:8000/mcp/';

    // FastMCP sunucusu 'tool_code' bekliyor
    const payload = {
        tool_code: `print(${tool}(**${JSON.stringify(args)}))`
    };

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API hatası: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const mcpResponse = await response.json();
    if (mcpResponse.content && mcpResponse.content.length > 0 && mcpResponse.content[0].text) {
        try {
            // Attempt to parse the text as JSON, as the backend tool returns a JSON string
            return JSON.parse(mcpResponse.content[0].text);
        } catch (e) {
            // If it's not a JSON string, return the text directly
            return mcpResponse.content[0].text;
        }
    }
    throw new Error("Beklenen formatta bir MCP yanıtı alınamadı.");
};

// Maps different API responses to a unified Decision format
const mapApiResponseToDecisions = (response: any): Decision[] => {
    if (!response || !response.decisions) return [];

    return response.decisions.map((item: any): Decision => {
        let title = "Başlık Bulunamadı";
        let summary = "Özet mevcut değil.";
        let court = "Bilinmeyen Mahkeme";
        let documentUrl = item.documentUrl || item.decision_page_url || item.source_url || item.document_url || '';
        let id = item.documentId || item.id || item.karar_id || documentUrl;

        if (item.itemType) { // Bedesten Unified Response Mapping
            title = `${item.birimAdi || item.itemType?.description || 'Karar'} - K:${item.kararNo || 'N/A'}`;
            summary = `Esas No: ${item.esasNo || 'N/A'} | Karar Tarihi: ${item.kararTarihiStr}`;
            court = mapCourtName(item.itemType?.name || 'DIĞER');
        } else if (item.title || item.decision_reference_no) { // Anayasa Unified Response Mapping
            title = item.title || item.decision_reference_no || 'Anayasa Mahkemesi Kararı';
            summary = item.application_subject_summary || `Başvuru No: ${item.decision_reference_no || 'N/A'}`;
            court = 'Anayasa Mahkemesi';
        }

        return {
            id,
            title,
            summary,
            date: item.kararTarihiStr || item.decision_date_summary || item.kararTarihi || 'Tarih Yok',
            decisionNumber: item.kararNo || item.decision_reference_no || 'No Yok',
            court,
            documentUrl
        };
    });
};

const mapCourtName = (itemType: string): string => {
    if (itemType.includes('YARGITAY')) return 'Yargıtay';
    if (itemType.includes('DANISTAY')) return 'Danıştay';
    if (itemType.includes('ISTINAF')) return 'Bölge Adliye Mahkemesi';
    if (itemType.includes('YERELHUKUK')) return 'Yerel Mahkeme';
    if (itemType.includes('KYB')) return 'Kanun Yararına Bozma';
    return 'Diğer';
}

/**
 * Uses Gemini to select the best MCP tool for a given search query.
 * @param query The user's natural language search query.
 * @returns An object with the tool name and its arguments.
 */
const selectSearchToolWithGemini = async (query: string): Promise<{ tool: string; args: { [key: string]: any } }> => {
    const toolDescriptions = `
        - search_bedesten_unified(phrase: str): Yargıtay, Danıştay ve diğer adli/idari mahkeme kararları için genel arama yapar. Genel ve spesifik olmayan sorgular için varsayılan olarak bu kullanılmalıdır. Örnek: "haksız rekabet", "boşanma davası".
        - search_anayasa_unified(phrase: str): Sadece Anayasa Mahkemesi kararlarını arar. Özellikle "bireysel başvuru", "hak ihlali", "anayasa", "norm denetimi" gibi anahtar kelimeler içeren sorgular için kullanılır. Örnek: "ifade özgürlüğü ihlali bireysel başvuru".
        - search_rekabet_unified(phrase: str): Sadece Rekabet Kurumu kararlarını arar. "rekabet ihlali", "kartel", "pazar hakimiyeti", "birleşme devralma" gibi terimler için kullanılır. Örnek: "çimento karteli soruşturması".
        - search_ihale_unified(phrase: str): Sadece Kamu İhale Kurumu (KİK) kararlarını arar. "kamu ihale", "ihaleden yasaklama", "aşırı düşük teklif", "itirazen şikayet" gibi terimler için kullanılır. Örnek: "sağlık bakanlığı personel alımı ihalesi itiraz".
    `;

    const prompt = `
        Kullanıcının hukuki arama sorgusunu analiz et ve en uygun arama aracını seç.
        Sorgu: "${query}"

        Mevcut araçlar ve açıklamaları:
        ${toolDescriptions}

        Seçimin için SADECE aşağıdaki formatta bir JSON nesnesi döndür:
        {
          "tool": "seçilen_aracın_adı",
          "args": {
            "phrase": "kullanıcının orijinal sorgusu"
          }
        }
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const textResponse = response.text.trim();
        const jsonMatch = textResponse.match(/```json\s*([\s\S]+?)\s*```/);
        const jsonString = jsonMatch ? jsonMatch[1] : textResponse;

        const parsed = JSON.parse(jsonString);
        if (parsed.tool && parsed.args && parsed.args.phrase) {
            console.log("Gemini tarafından seçilen araç:", parsed);
            return parsed;
        }
    } catch (error) {
        console.error("Gemini aracı seçerken hata oluştu:", error);
    }

    // Fallback to the general search tool
    console.log("Gemini'den geçerli yanıt alınamadı, varsayılan araca dönülüyor.");
    return {
        tool: 'search_bedesten_unified',
        args: { phrase: query }
    };
};

export const searchDocuments = async (query: string, page: number, pageSize: number = 50): Promise<SearchResponse> => {
    try {
        const { tool, args } = await selectSearchToolWithGemini(query);

        const finalArgs: { [key: string]: any } = {
            ...args,
            pageNumber: page,
            pageSize: pageSize,
        };

        if (tool === 'search_bedesten_unified') {
            finalArgs.court_types = ["YARGITAYKARARI", "DANISTAYKARAR", "YERELHUKUK", "ISTINAFHUKUK", "KYB"];
        }

        const backendResponse = await callMCPTool(tool, finalArgs);

        if (typeof backendResponse === 'string') {
            throw new Error(`Beklenmedik bir sunucu yanıtı: ${backendResponse}`);
        }

        const results = mapApiResponseToDecisions(backendResponse);
        const total = backendResponse.total_records || backendResponse.total || 0;

        return { results, total, error: null };

    } catch (error) {
        console.error("yargi-mcp backend'ine bağlanırken hata oluştu:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes('Failed to fetch')) {
            return {
                results: [], total: 0,
                error: "MCP sunucusuna bağlanılamadı. Lütfen sunucunun çalıştığından emin olun ve bağlantı ayarlarını kontrol edin.",
            };
        }
        return { results: [], total: 0, error: `Arama sırasında beklenmedik bir hata oluştu: ${errorMessage}` };
    }
};

/**
 * Belirli bir kararın tam metnini MCP sunucusundan alır.
 * URL'yi analiz ederek doğru getirme aracını yönlendirir.
 * @param decision Karar nesnesi.
 * @returns Kararın tam metnini içeren bir Promise.
 */
export const getDocument = async (decision: Decision): Promise<string> => {
    let tool: string;
    let args: { [key: string]: any };

    if (decision.documentUrl && decision.documentUrl.includes('anayasa.gov.tr')) {
        tool = 'get_anayasa_document_unified';
        try {
            const urlPath = new URL(decision.documentUrl).pathname;
            args = { document_url: urlPath, page_number: 1 };
        } catch (e) {
            console.error("Geçersiz Anayasa Mahkemesi URL'si:", decision.documentUrl)
            return "Geçersiz belge URL'si."
        }
    } else {
        tool = 'get_bedesten_document_markdown';
        args = { documentId: decision.id };
    }

    console.log(`Tam metin isteniyor: tool='${tool}', args=`, args);

    try {
        const result = await callMCPTool(tool, args);
        if (typeof result !== 'object' || result === null) {
            return "Belge içeriği alınamadı (geçersiz format).";
        }
        return result.markdown_content || result.document_data?.markdown_chunk || result.markdown_chunk || "Belge içeriği alınamadı.";
    } catch (error) {
        console.error("Belge metni alınırken hata:", error);
        return "Belge içeriği yüklenirken bir hata oluştu.";
    }
};


/**
 * Verilen hukuki metni Gemini kullanarak özetler.
 * @param text Özetlenecek olan metin.
 * @returns Yapay zeka tarafından oluşturulan özet metni.
 */
export const summarizeWithGemini = async (text: string): Promise<string> => {
    if (!text) {
        return "Özetlenecek metin bulunamadı.";
    }

    try {
        const prompt = `Aşağıdaki hukuki metni, konunun uzmanı olmayan bir kişinin anlayabileceği şekilde, ana noktaları vurgulayarak sade bir dille özetle. Özet, metnin en kritik ve sonuç odaklı kısımlarını içermelidir:\n\n---\n\n${text}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Gemini API ile özetleme sırasında hata oluştu:", error);
        return "Yapay zeka ile özetleme sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
    }
};
