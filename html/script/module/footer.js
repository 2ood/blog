  const footer = document.getElementsByTagName("footer")[0];
  console.log("buildFooter");
  if(!(footer===null))footer.innerHTML+=`
  <div> developed by <a href="https://github.com/2ood">2ood.</a></div>
  <div> MIT licensed. 2022</div>
  `;
