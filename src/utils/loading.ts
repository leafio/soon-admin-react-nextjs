export function startLoading(dom?: Element | null) {
  if (document.querySelector(".loading-box")) return
  const loading = document.createElement("div")
  loading.classList.add("loading-box")
  loading.innerHTML = `<span class="dot dot-spin"><i></i><i></i><i></i><i></i></span>`
  ;(dom ?? document.body).appendChild(loading)
}

export function endLoading() {
  document.querySelector(".loading-box")?.remove()
}

// export function createLoading() {
//   return {
//     add(dom?: Element | null) {
//       if (document.querySelector(".loading-box")) return
//       const loading = document.createElement("div")
//       loading.classList.add("loading-box")
//       loading.innerHTML = `<span class="dot dot-spin"><i></i><i></i><i></i><i></i></span>`;
//       (dom ?? document.body).appendChild(loading)
//     },
//     remove(){

//     }

//   }
// }
