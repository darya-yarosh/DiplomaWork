/**
 * Converter for rendering data on page.
 */
export default class RenderConverter {
    /**
     * Converting text.
     * 
     * @param text  text for converting.
     * 
     * @return converted text.
     */
    convert(text: string) {
        let resultText = "";
        if (text !== null) {
            let convertedText: string[] = [];
            convertedText = this.convertSpaces(text);
            resultText = convertedText.join('');
        }
        return resultText;
    }

    /**
     * Convert spaces on the text.
     * 
     * @param text  text for converting.
     * 
     * @return text with converted spaces for rendering.
     */
    convertSpaces(text: string) {
        let convertedText = text.split('');
        convertedText.forEach((symbol, symbolIndex) => {
            const isSpace = symbol === " ";
            if (isSpace) {
                convertedText[symbolIndex] = '\u00A0';
            }
        })
        return convertedText;
    }
}