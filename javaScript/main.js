const loadData = async (sortView) => {
  let res = await fetch("https://openapi.programming-hero.com/api/ai/tools");
  let data = await res.json();
  let aiData = data.data?.tools;
  const cardDiv = document.getElementById("cardDiv");
  cardDiv.innerHTML = ''
  if (sortView) {
    aiData.sort((a, b) => {
        const first = a.published_in;
        const second = b.published_in;
        return parseDate(first) - parseDate(second);
    });
}   


   if(!isShow){
     aiData = aiData.slice(0, 6)
     hideBtn.classList.add('hidden')
     showBtn.classList.remove('hidden')
    }else{
     showBtn.classList.add('hidden')
     hideBtn.classList.remove('hidden')
   }
  aiData.forEach((singleData) => {
    const { image, name, features, published_in, id } = singleData;
    const appendDiv = document.createElement("div");
    appendDiv.classList.add("card", "bg-base-100", "shadow-xl");
    appendDiv.innerHTML = `
      <figure class="p-4">
      <img class="min-w-96 min-h-52 max-w-full max-h-52" src="${image}" alt="Shoes" />
      </figure>
      
      <div class="card-body w-full px-4">
      <h2 class="text-2xl font-bold">features</h2>
      <div class=" px-8">
      <ul></ul> <!-- Removed id, as it's being appended multiple times -->
      </div>

      <hr class="mt-5 mb-5"/>
      <h2 class="card-title w-full">
      ${name}
      </h2>
      <div class="card-actions justify-between items-center">
      <div class="badge badge-outline p-4 text-emerald-400">${published_in}</div>
      <div> <button class="btn btnId rounded-full border text-orange-500"><i class="fa-solid fa-angles-right"></i></button></div>
      
      </div>
      </div>
      `;
    cardDiv.appendChild(appendDiv);

    const ul = appendDiv.querySelector("ul");
    features.forEach((f) => {
      const li = document.createElement("li");
      li.classList.add("list-decimal");
      li.innerText = f;
      ul.appendChild(li);
    });

    const button = appendDiv.querySelector(".btnId");
    let modal = document.getElementById("myModal");
    let span = document.getElementsByClassName("close")[0];
    const modalBody = document.getElementById("modalBody");
    button.addEventListener("click", () => {
      modal.style.display = "block";
      fetch(`https://openapi.programming-hero.com/api/ai/tool/${id}`)
        .then((res) => res.json())
        .then((data) => {
          let modalContent = data?.data;

          const { description, features, integrations, accuracy } =  modalContent;
         
        
          const modalDiv = document.createElement("div");
          modalDiv.classList.add(
            "lg:flex",
            "md:flex",
            "justify-center",
            "items-center",
            "gap-4",
            "lg:p-10",
            "p-2"
          );
          
          modalDiv.innerHTML = `
          <div class="bg-[#EB57570D] border w-1/2 border-[#EB5757] rounded-2xl p-6">
          <div>
            <h2 class="text-2xl font-medium text-justify text-black">${description}</h2>
          </div>
          <div class=" lg:flex md:flex justify-center items-center gap-2 ">
              <div class=" w-[30%]  border-none rounded-xl bg-white p-6">
                <h2 class="text-xl text-black font-medium">${
                  modalContent?.pricing?.[0]?.price || "0"
                }</h2>
                <p class=" text-lg">${
                  modalContent?.pricing?.[0]?.plan || "Unavailable"
                }</p>
              </div>
              <div class=" w-[30%] border-none rounded-xl bg-white p-6">
              <h2 class="text-xl text-black font-medium">${
                modalContent?.pricing?.[1]?.price
              }</h2>
              <p class=" text-lg">${modalContent?.pricing?.[1]?.plan}</p>
              </div>
              <div class=" w-[40%] border-none rounded-xl bg-white p-6">
              <h2 class="text-lg text-black font-medium">${
                modalContent?.pricing?.[2]?.price
              }</h2>
              <p class=" text-lg">${modalContent?.pricing?.[2]?.plan}</p>
              </div>
          </div>

          <div class=" lg:flex md:flex justify-between gap-2 items-left">
            <div>
              <h2 class="text-black text-xl font-bold"> Features</h2>
              <div class="pl-5">
              <ul id="features" class="w-full ">
              </ul>
              </div>
            </div>

            <div>
              <h2 class="text-black text-xl font-bold">Integration</h2>
              <div class="pl-5">
              <ul id="integration" class="w-full ">
              </ul>
              </div>
            </div>
          </div>
      </div>
      <div class="w-1/2 text-center">
            <div class="relative">
            <img class="w-full min-w-[440px] h-full max-h-[250px] rounded-md" src=${
              modalContent?.image_link?.[0] || "No image Available"
            } alt="">

            <div id="accDiv" class="absolute top-2 right-1 bg-emerald-400  px-4 py-1 text-center rounded-xl">
             
            </div>
            </div>
          <div class="w-full p-4">
            <h2 class="text-2xl font-bold text-black">${
              modalContent?.input_output_examples?.[0].input
            }</h2>
            <p>${modalContent?.input_output_examples?.[0].output}</p>
          </div>
      </div>
          `;

          const accDiv = modalDiv.querySelector("#accDiv")
          if(accuracy.score){
            const tag = document.createElement("h2");
            tag.classList.add('text-white')
            tag.innerHTML=`
              <span>${accuracy?.score * 100}%</span> Accuracy
            `
            accDiv.appendChild(tag);
          }else{
            accDiv.classList.add('hidden')
          }
         
          const integration = modalDiv.querySelector("#integration");
          if (!integrations) {
            const intiLi = document.createElement("li");
            intiLi.classList.add("list-disc");
            intiLi.innerText = `No integration`;
            integration.appendChild(intiLi);
          } else {
            integrations.forEach((list) => {
              const intiLi = document.createElement("li");
              intiLi.classList.add("list-disc");
              intiLi.innerText = `${list}`;
              integration.appendChild(intiLi);
            });
          }

          const feature = modalDiv.querySelector("#features");
          const featureNames = [];

          for (const key in features) {
            if (features.hasOwnProperty(key)) {
              const feature = features[key];
              featureNames.push(feature.feature_name);
            }
          }
          featureNames.forEach((fname) => {
            const feaLi = document.createElement("li");
            feaLi.classList.add("list-disc");
            feaLi.innerText = `${fname}`;
            feature.appendChild(feaLi);
          });

          modalBody.appendChild(modalDiv);
        });
    });

    span.addEventListener("click", () => {
      modal.style.display = "none";
      modalBody.innerHTML = "";
    });

    window.addEventListener("click", (event) => {
      if (event.target == modal) {
        modal.style.display = "none";
        modalBody.innerHTML = "";
      }
    });
  });
};

const btn = document.getElementById('sortBtn')
let sortView = false;

btn.addEventListener("click", ()=>{
  sortView = true;
  loadData(sortView)
})


const parseDate = (dateString) => {
  const [month, day, year] = dateString.split("/");
  return new Date(year, month - 1, day);
};

let isShow = false;
const showBtn = document.getElementById('showBtn')
const hideBtn = document.getElementById('hideBtn')
function handleShow() {
  isShow = true; 
  loadData(sortView);

}
function handleHide(){
  isShow = false;
  loadData(sortView)
}
loadData();
