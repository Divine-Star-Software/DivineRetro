export function probability (n : number) : boolean  {
      return !!n && Math.random() <= n;
  };


export function cloneData(data : any) {
    return JSON.parse(JSON.stringify(data));
}

export function UUID() {
    return Math.floor(Math.random() * Date.now());
}