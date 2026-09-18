/**
 * Σειριοποίηση JSON-LD για ενσωμάτωση σε `<script>`.
 *
 * Το περιεχόμενο (τίτλοι, περιγραφές, brands) το γράφει ο merchant από το
 * dashboard. Ένα σκέτο `</script>` μέσα σε περιγραφή τερματίζει το script
 * element — ακόμα και με `type="application/ld+json"` — και ό,τι ακολουθεί
 * αποδίδεται ως HTML. Το `<` γίνεται `<`, που είναι έγκυρο JSON και
 * ισοδύναμο μετά το parse, αλλά αβλαβές για τον HTML parser.
 */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function formatPrice(value: number): string {
  return `${value.toLocaleString("el-GR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;
}
