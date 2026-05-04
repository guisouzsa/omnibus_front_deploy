/**
 * Máscara para CEP (XXXXX-XXX)
 */
export const maskCEP = (value: string): string => {
  if (!value) return "";
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

/**
 * Remove máscara de CEP
 */
export const unmaskCEP = (value: string): string => {
  return value.replace(/\D/g, "");
};

/**
 * Máscara para valor monetário (R$ com separadores de milhares)
 * Ex: 1000 -> R$ 1.000,00
 */
export const maskCurrency = (value: string): string => {
  if (!value) return "R$ 0,00";
  
  // Remove tudo que não é número
  let digits = value.replace(/\D/g, "");
  
  // Se vazio, retorna formato padrão
  if (!digits) return "R$ 0,00";
  
  // Converte para número e formata
  const number = parseInt(digits, 10);
  const formatted = (number / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  
  return formatted;
};

/**
 * Remove máscara de moeda, retornando apenas o número
 * Ex: "R$ 1.000,50" -> 1000.50
 */
export const unmaskCurrency = (value: string): number => {
  const cleaned = value.replace(/\D/g, "");
  return parseInt(cleaned, 10) / 100;
};

/**
 * Máscara para valor monetário simples (sem símbolo)
 * Permite input numérico e converte automaticamente
 */
export const maskMoneyInput = (value: string): string => {
  if (!value) return "";
  
  // Remove tudo que não é número ou vírgula
  let cleaned = value.replace(/[^\d,]/g, "");
  
  // Remove vírgulas extras (manter apenas uma)
  const parts = cleaned.split(",");
  if (parts.length > 2) {
    cleaned = `${parts.slice(0, -1).join("")},${parts[parts.length - 1]}`;
  }
  
  // Se tiver vírgula, limita a 2 casas decimais
  if (cleaned.includes(",")) {
    const [integerPart, decimalPart] = cleaned.split(",");
    return `${integerPart},${decimalPart.slice(0, 2)}`;
  }
  
  return cleaned;
};
