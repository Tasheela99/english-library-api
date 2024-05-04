function generateRandomPostFix(length) {
    const characters = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

const generateCode = (category) => {
    let prefix = '';
    switch (category.toUpperCase()) {
        case 'FREE':
            prefix = 'FREE';
            break;
        case 'GRAMMAR':
            prefix = 'GRAM';
            break;
        case 'DIALOGUE':
            prefix = 'DLOG';
            break;
        case 'SENTENCE_PATTERN':
            prefix = 'SENT';
            break;
        default:
            prefix = category;
            break;
    }
    const postFix = generateRandomPostFix(3);
    return `${prefix}-${postFix}`;
}

module.exports = {
    generateCode,
}