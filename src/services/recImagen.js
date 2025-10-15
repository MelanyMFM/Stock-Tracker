import {API_KEY} from "../../config.js";

async function reconocerImagen(file) {



  const form = new FormData();
  form.append("apikey", API_KEY);
  form.append("isOverlayRequired", "false");
  form.append("file", file);

  const resp = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    body: form
  });
  const j = await resp.json();
  // j.ParsedResults[0].ParsedText tiene el texto reconocido
  return j;
}

export { reconocerImagen };