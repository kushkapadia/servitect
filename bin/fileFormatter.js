// Utility Function to remove unnecessary indentation and tab spaces

const removeIndentation = (str) => {
    const lines = str.split("\n");
    const minIndent = Math.min(
        ...lines.filter(line => line.trim()).map(line => line.match(/^(\s*)/)[1].length)
    );
    return lines.map(line => line.slice(minIndent)).join("\n").trim();
};
module.exports = removeIndentation;