import { Content, validateContent } from "@/schemas/content";

/**
 * Rezultat serijalizacije sadržaja
 */
export interface SerializeResult {
  success: boolean;
  data?: string;
  error?: string;
}

/**
 * Rezultat deserijalizacije sadržaja
 */
export interface DeserializeResult {
  success: boolean;
  data?: Content;
  error?: string;
  validationErrors?: string[];
}

/**
 * Pretvara Content u JSON string za spremanje u bazu podataka
 * @param content - Content objekt za serijalizaciju
 * @returns SerializeResult sa stringom ili greškom
 */
export const serializeContent = (content: Content): SerializeResult => {
  try {
    // Prvo validiraj content
    const validation = validateContent(content);

    if (!validation.success) {
      return {
        success: false,
        error:
          "Sadržaj nije valjan: " +
          validation.error.issues.map((i) => i.message).join(", "),
      };
    }

    // Serijaliziraj u JSON string
    const jsonString = JSON.stringify(validation.data, null, 0);

    return {
      success: true,
      data: jsonString,
    };
  } catch (error) {
    return {
      success: false,
      error: `Greška pri serijalizaciji: ${
        error instanceof Error ? error.message : "Nepoznata greška"
      }`,
    };
  }
};

/**
 * Pretvara JSON string iz baze podataka u Content objekt
 * @param jsonString - JSON string iz baze podataka
 * @returns DeserializeResult sa Content objektom ili greškom
 */
export const deserializeContent = (jsonString: string): DeserializeResult => {
  try {
    // Provjeri da li je string prazan ili null
    if (!jsonString || jsonString.trim() === "") {
      return {
        success: true,
        data: [], // Prazan content
      };
    }

    // Pokušaj parsirati JSON
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonString);
    } catch (parseError) {
      return {
        success: false,
        error: `Neispravan JSON format: ${
          parseError instanceof Error ? parseError.message : "Nepoznata greška"
        }`,
      };
    }

    // Validiraj parsed podatke
    const validation = validateContent(parsed);

    if (!validation.success) {
      return {
        success: false,
        error: "Sadržaj nije valjan prema schemi",
        validationErrors: validation.error.issues.map(
          (issue) => `${issue.path.join(".")}: ${issue.message}`
        ),
      };
    }

    return {
      success: true,
      data: validation.data,
    };
  } catch (error) {
    return {
      success: false,
      error: `Greška pri deserijalizaciji: ${
        error instanceof Error ? error.message : "Nepoznata greška"
      }`,
    };
  }
};
