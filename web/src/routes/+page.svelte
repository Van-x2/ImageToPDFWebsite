<script>
  import { jsPDF } from "jspdf";
  import Device from 'svelte-device-info'
  let mobile = false

  if (typeof window !== 'undefined') {
	  if (Device.isMobile) {
    mobile = true
  }
}
  
  let uploadedFiles = [];
  let revealed = false
  let pdfName = ''

  function generatePDF() {
    const doc = new jsPDF();
    let i = 1
    console.log(uploadedFiles.length)
    doc.addImage(uploadedFiles[0].imgURL, 'PNG', 0, 0, 210, 298);
    while ( i < (uploadedFiles.length) ) {
      // Add second page with image
      doc.addPage()
      doc.addImage(uploadedFiles[i].imgURL, 'PNG', 0, 0, 210, 298);
      

    i = i + 1
    }
    // Save or download the PDF
    doc.save(pdfName);
  }

  async function handleFileUpload(event) {
  // Clear the previous uploaded files
  const files = Array.from(event.target.files);
  uploadedFiles = [];

  for (const file of files) {
    try {
      const dataURL = await getDataURLFromFile(file);
      uploadedFiles = [...uploadedFiles, {
        name: file.name,
        imgURL: dataURL
      }];
    } catch (error) {
      console.error("Error reading file:", error);
    }
  }
  revealed = true;
}

async function getDataURLFromFile(file) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  return new Promise((resolve, reject) => {
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        // Convert the canvas back to a data URL
        canvas.toBlob(blob => {
          const url = URL.createObjectURL(blob);
          resolve(url);
        }, file.type);
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
  });
}
</script>
{#if !mobile}
<div class="w-screen h-screen bg-gradient-to-br from-teal-50 to-slate-500 flex justify-center items-center">
  <div class="bg-gradient-to-br from-slate-200 to-orange-50 w-2/4 h-[80%] rounded-3xl shadow-lg p-6 px-7">
    <div class="w-full h-full flex flex-col items-center">
      <h1 class="font-poppins font-bold text-4xl text-center p-2 bg-gradient-to-tr from-sky-700 to-slate-400 bg-clip-text text-transparent">
        Image to PDF Converter
      </h1>
      <p class="text-center font-poppins text-[18px] mt-3 mb-10 text-gray-300">Created by:
        <a href="https://www.google.com/">
          <span class="font-bold italic bg-gradient-to-tr from-slate-500 to-cyan-700 bg-clip-text text-transparent transition-colors duration-200 hover:text-pink-500">&nbsp;Vann S.</span>
        </a>
      </p>
      <form action="#" class="relative w-[95%] h-40 max-w-xs mb-10 bg-rounded-lg shadow-inner">
        <input type="file" id="file-upload" class="hidden" multiple accept=".jpeg, .jpg, .heic, .png, .heif" on:change={handleFileUpload}>
        <label for="file-upload" class="border-cyan-700 border-[3px] z-20 flex rounded-lg flex-col-reverse items-center justify-center w-full h-full cursor-pointer transition duration-100 hover:bg-slate-200">
          <p class="z-10 text-xs font-light text-center text-gray-500">Upload your .HEIC, .PNG, .JPEG files here</p>
          <p class="z-10 text-xs font-light text-center text-gray-500">Click here, to upload images</p>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-9 h-9 m-2 fill-cyan-700">
            <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clip-rule="evenodd" />
          </svg>
        </label>
      </form>
      {#if revealed}
        <div class="w-full h-auto top-5 p-2 flex flex-wrap justify-center items-center bg-gray-300 rounded-3xl">
          {#each uploadedFiles as file, i}
            <div class="m-2 p-2 border-[3px] border-cyan-700 rounded-lg shadow h-[260px] w-[140px] bg-white">
              <p class="text-center text-[13px] mb-2 italic font-bold text-gray-500">{file.name}
              </p>
              <div class="flex justify-center items-center">
                <img src={file.imgURL} class="h-[200px] w-[105px] flex justify-center items-center" alt={file.name}>
              </div>
            </div>
          {/each}
        </div>
        <input placeholder=" PDF name here:" type="text" class="w-[100%] h-[6%] border mt-[20px] bg-gray-300 rounded-lg text-[15px] font-poppins font-italic italic text-cyan-700 border-slate-200 transition duration-300 hover:border-[3px] hover:border-cyan-600 focus:bg-" bind:value={pdfName}>
        <button class="w-[100%] h-[6%] border mt-[20px] bg-gray-300 rounded-lg text-[20px] font-poppins font-semibold italic text-cyan-700 border-slate-200 transition duration-300 hover:border-[3px] hover:border-cyan-600 focus:bg-" on:click={generatePDF}>Download PDF</button>
      {/if}
    </div>
  </div>
</div>
{/if}

{#if mobile}
<div class="w-screen h-screen bg-gradient-to-br from-slate-200 to-orange-50 flex justify-center items-center">
    <div class="w-full h-full flex flex-col items-center">
      <h1 class="font-poppins font-bold text-4xl text-center p-2 bg-gradient-to-tr from-sky-700 to-slate-400 bg-clip-text text-transparent">
        Image to PDF Converter
      </h1>
      <p class="text-center font-poppins text-[18px] mt-3 mb-10 text-gray-300">Created by:
        <a href="https://www.google.com/">
          <span class="font-bold italic bg-gradient-to-tr from-slate-500 to-cyan-700 bg-clip-text text-transparent transition-colors duration-200 hover:text-pink-500">&nbsp;Vann S.</span>
        </a>
      </p>
      <form action="#" class="relative w-[95%] h-40 max-w-xs mb-10 bg-rounded-lg shadow-inner">
        <input type="file" id="file-upload" class="hidden" multiple accept=".jpeg, .jpg, .heic, .png, .heif" on:change={handleFileUpload}>
        <label for="file-upload" class="border-cyan-700 border-[3px] z-20 flex rounded-lg flex-col-reverse items-center justify-center w-full h-full cursor-pointer transition duration-100 hover:bg-slate-200">
          <p class="z-10 text-xs font-light text-center text-gray-500">Upload your .HEIC, .PNG, .JPEG files here</p>
          <p class="z-10 text-xs font-light text-center text-gray-500">Click here, to upload images</p>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-9 h-9 m-2 fill-cyan-700">
            <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clip-rule="evenodd" />
          </svg>
        </label>
      </form>
      {#if revealed}
        <div class="w-[90%] h-auto top-5 p-2 flex flex-wrap justify-center items-center bg-gray-300 rounded-3xl">
          {#each uploadedFiles as file, i}
            <div class="m-2 p-2 border-[3px] border-cyan-700 rounded-lg shadow h-[260px] w-[140px] bg-white">
              <p class="text-center text-[13px] mb-2 italic font-bold text-gray-500">{file.name}
              </p>
              <div class="flex justify-center items-center">
                <img src={file.imgURL} class="h-[200px] w-[105px] flex justify-center items-center" alt={file.name}>
              </div>
            </div>
          {/each}
        </div>
        <input placeholder=" PDF name here:" type="text" class="w-[70%] h-[6%] border mt-[20px] bg-gray-300 rounded-lg text-[15px] font-poppins font-italic italic text-cyan-700 border-slate-200 transition duration-300 hover:border-[3px] hover:border-cyan-600 focus:bg-" bind:value={pdfName}>
        <button class="w-[70%] h-[6%] border mt-[20px] bg-gray-300 rounded-lg text-[20px] font-poppins font-semibold italic text-cyan-700 border-slate-200 transition duration-300 hover:border-[3px] hover:border-cyan-600 focus:bg-" on:click={generatePDF}>Download PDF</button>
      {/if}
    </div>
  </div>
{/if}