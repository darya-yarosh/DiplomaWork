export default class RenderConverter {
    convert(text: string) {
        let resultText = "";
        if (text !== null) {
            let convertedText: string[] = [];
            convertedText = this.convertSpaces(text);
            resultText = convertedText.join('');
        }
        return resultText;
    }

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