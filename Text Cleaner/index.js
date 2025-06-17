 function countStats(text) {
      const characters = text.length;
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      return { characters, words };
    }

    function removeSpaces() {
      const inputText = document.getElementById("input").value;

      const beforeStats = countStats(inputText);
      document.getElementById("statsBefore").innerHTML =
        `<strong>Before:</strong> ${beforeStats.characters} characters, ${beforeStats.words} words`;

      const cleaned = inputText.replace(/[\s\u200B]+/g, '');
      const afterStats = countStats(cleaned);
      document.getElementById("output").textContent = cleaned;
      document.getElementById("statsAfter").innerHTML =
        `<strong>After:</strong> ${afterStats.characters} characters, ${afterStats.words} words`;
    }

    function copyOutput() {
      const outputText = document.getElementById("output").textContent;
      if (!outputText) {
        alert("Kuch text toh hona chahiye copy karne ke liye 😅");
        return;
      }

      const tempTextArea = document.createElement("textarea");
      tempTextArea.value = outputText;
      document.body.appendChild(tempTextArea);
      tempTextArea.select();
      document.execCommand("copy");
      document.body.removeChild(tempTextArea);

      alert("Text copied to clipboard! 📋");
    }