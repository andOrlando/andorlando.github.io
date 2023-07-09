export const weighted_random=(w,l=0,u=1)=>{let r=Math.random(),g=r>0.5;return(((r-g/2)*2)**w/2*(1-2*g)+g)*(u-l)+l}
export const skewed_random=(w,l=0,u=1)=>(Math.random()**w)*(u-l)+l
