export default class SharedFunctions {
  public static getIdfromURL(url: string): number {
    return Number.parseInt(url.split('=')[1]);
  }

  public static yesOrNo(s: string): boolean {
    if (s === 'No') {
      return false;
    }
    return true;
  }
}
