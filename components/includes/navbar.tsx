import logo from "@/public/img/saving_grains_logo_dark.png";
import user from "@/public/img/user.svg";
import { CountryDropdown } from "../country-dropdown";

export function Navbar() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-30 h-16 w-full border-b border-[#D6D8DA] bg-white px-4 py-2 sm:h-20 sm:px-6 sm:py-[9px] md:px-10">
      <div className="flex h-full items-center justify-between">
        {/*..... Logo...... */}
        <img
          src={"../img/saving_grains_logo_dark.png"}
          alt="Saving Grains"
          className="h-12 w-14 sm:h-[60px] sm:w-[70px] md:h-[70px] md:w-[80px]"
        />

        {/* ......Language + User........ */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5">
          <CountryDropdown />
          <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-200 sm:h-9 sm:w-9 md:h-10 md:w-10">
            <img
              src={"../img/user.svg"}
              alt="User"
              className="h-6 w-6 sm:h-7 sm:w-7 md:h-[32px] md:w-[32px]"
            />
          </button>
        </div>
      </div>
    </nav>
  );
}
