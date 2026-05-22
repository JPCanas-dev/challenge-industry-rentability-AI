
  import "./style.css";

  const app = document.querySelector("#app");

  app.innerHTML = `
    <main class="container">
      
      <h1>Analizador de rentabilidad con IA</h1>

      <p class="description">
        Analiza si un producto puede generar buenas ganancias usando inteligencia artificial.
        El análisis estará enfocado en el mercado colombiano y todos los valores se interpretarán en pesos colombianos (COP).
      </p>

      <select id="platform">
        <option value="">Selecciona dónde venderás</option>
        <option value="Facebook Marketplace">Facebook Marketplace</option>
        <option value="Instagram / TikTok">Instagram / TikTok</option>
        <option value="E-commerce">E-commerce</option>
        <option value="Tienda fisica">Tienda física</option>
      </select>

      <textarea 
        id="input" 
        placeholder="Ejemplo: Adquiero camisetas por un costo unitario de 25.000 COP y planeo comercializarlas con un precio de venta de 55.000 COP."
      ></textarea>

      <button id="generate">
        Analizar producto
      </button>

      <section class="result" id="result">
        El análisis aparecerá aquí...
      </section>

    </main>
  `;

  const button = document.querySelector("#generate");
  const result = document.querySelector("#result");

  button.addEventListener("click", async () => {

    const input = document.querySelector("#input").value;
    const platform = document.querySelector("#platform").value;

    if (!input.trim()) {
      result.textContent = "Debes escribir información del producto.";
      return;
    }

    if (!platform) {
      result.textContent = "Debes seleccionar una plataforma de venta.";
      return;
    }

    result.textContent = "Generando análisis con IA...";

    const prompt = `

  Eres un experto en negocios y rentabilidad.

  Analiza la idea de negocio del usuario considerando el mercado colombiano y usando pesos colombianos (COP).

  La plataforma principal de venta será:
  ${platform}

  Responde ÚNICAMENTE con estas 7 secciones y nada más:

  1. Resumen del producto
  2. Ganancia y margen aproximado
  3. Nivel de rentabilidad
  4. Riesgos principales
  5. Recomendaciones de venta
  6. Consejos para vender en ${platform}
  7. Conclusión final

  DESPUÉS DEL PUNTO 7, FINALIZA AHÍ, ES DECIR, NO AÑADAS MÁS TEXTO.

  Usa un tono claro, profesional y organizado.

  Información del usuario:
  ${input}

    `;

    try {

      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "phi3",
          prompt,
          stream: false,
        }),
      });

      const data = await response.json();

      result.innerHTML = data.response.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/(\d+\.\s.*?:)/g, "<strong>$1</strong>").replace(/\n/g, "<br>");

    } catch (error) {

      result.textContent = "Error conectando con Ollama.";
      console.error(error);

    }

  });