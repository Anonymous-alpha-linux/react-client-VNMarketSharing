import Cookie from "universal-cookie";

export function useCookie() {
   const cookie = new Cookie();
   function addCookie(cookieName: string, cookieValue: string): void {
      cookie.set(cookieName, cookieValue, {
         sameSite: "strict",
         path: "/",
         expires: new Date(new Date().getTime() + 5 * 1000),
         httpOnly: true,
         secure: false,
      });
   }

   function removeCookie(cookieName: string) {
      cookie.remove(cookieName);
   }
   return [cookie, addCookie, removeCookie];
}
