// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import countries from "@base/countries.json";
// import Fuse from "fuse.js";
// import { ChevronDown } from "lucide-react";
// import { useMemo, useState } from "react";
// import { Country } from "../types";
// import { Input, InputProps } from "./ui/input";
// import { Label } from "./ui/label";

// type Props = InputProps & {
//   label: string;
//   country: string;
//   setCountry: (v: string) => void;
// };

// export function PhoneNumberInput(props: Props) {
//   const { label, country, setCountry, ...rest } = props;
//   const [searchQuery, setSearchQuery] = useState("");

//   // Computed
//   const selected = useMemo(() => {
//     return countries.find((item) => item.code === country);
//   }, [countries, country]);

//   const filteredCountries = useMemo<Array<Country>>(() => {
//     const query = searchQuery.trim();

//     if (query === "") {
//       return countries;
//     }

//     const fuse = new Fuse(countries, {
//       keys: ["name", "dialCode"],
//     });

//     return fuse.search(query).map((item) => item.item);
//   }, [countries, searchQuery]);

//   return (
//     <>
//       <div className="relative">
//         <Label
//           className={`pointer-events-none absolute -top-2 left-1 z-10 bg-background px-2 text-xs text-gray-500 transition-all duration-200`}
//         >
//           {label}
//         </Label>

//         <div className="absolute left-0 top-0 inline-flex h-full">
//           <DropdownMenu>
//             <DropdownMenuTrigger className="inline-flex w-full items-center justify-center space-x-1 px-1.5 text-sm text-gray-600">
//               <span className="text-base">{selected?.flag}</span>
//               <ChevronDown size={16} />
//             </DropdownMenuTrigger>

//             <DropdownMenuContent>
//               <Input
//                 placeholder="Search..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />

//               <DropdownMenuSeparator />

//               <div className="h-full max-h-[400px] overflow-auto">
//                 {filteredCountries.map((item) => (
//                   <DropdownMenuItem
//                     key={item.code}
//                     className="space-x-1.5"
//                     onClick={() => setCountry(item.code)}
//                   >
//                     <span className="text-base">{item?.flag}</span>
//                     <span>{item?.name}</span>
//                   </DropdownMenuItem>
//                 ))}
//               </div>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>

//         <Input className="pl-12" {...rest} />
//       </div>
//     </>
//   );
// }
