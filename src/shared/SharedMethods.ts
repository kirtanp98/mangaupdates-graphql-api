export default class SharedFunctions {
  public static getIdfromURL(url: string): number {
    return Number.parseInt(url.split('=')[1]);
  }
}
