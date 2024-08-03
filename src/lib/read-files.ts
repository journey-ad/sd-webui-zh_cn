// Load file
export function readFile(filePath) {
        let request = new XMLHttpRequest();
        request.open("GET", `file=${filePath}`, false);
        request.send(null);
        return request.responseText;
}