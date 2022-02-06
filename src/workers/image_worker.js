
onmessage = async (evt) => {
  const urls = evt.data;
  

  const images = await Promise.all(
    urls.map(async (url) => {
      try {
        const response = await fetch(url, { mode: "cors"});
        const fileBlob = await response.blob();

        if (/image\/.+/.test(fileBlob.type)) {
          return URL.createObjectURL(fileBlob);
        }
      } catch (e) {
        return null;
      }
    })
  );
  console.log(images);
  postMessage(images);
};
