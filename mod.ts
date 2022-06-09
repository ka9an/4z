export const VE = '1.0.0'



export async function pre() {
  console.log('on prepublish')
}


export async function post() {
  console.log('on postpublish')
}
