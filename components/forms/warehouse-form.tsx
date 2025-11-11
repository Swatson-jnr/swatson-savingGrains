// import { Warehouse } from "@/types";
// import countries from "@base/countries.json";
// import { Link, useForm } from "@inertiajs/react";
// import { FormEvent } from "react";
// import { Button } from "../ui/button";
// import { FloatingLabelInput } from "../ui/floating-label-input";
// import { FloatingLabelSelect } from "../ui/floating-label-select";
// import { Message } from "../ui/message";

// type Props = {
//   warehouse?: Warehouse;
// };

// export function WarehouseForm({ warehouse }: Props) {
//   // State
//   const form = useForm({
//     name: warehouse?.name || "",
//     country: warehouse?.country || "Ghana",
//     location: warehouse?.location || "",
//   });

//   // Methods
//   const onSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     warehouse?.id
//       ? form.patch(route("web.settings.warehouses.update", warehouse?.id))
//       : form.post(route("web.settings.warehouses.store"));
//   };

//   // Render
//   return (
//     <>
//       <div className="w-full max-w-md">
//         <form onSubmit={onSubmit}>
//           <div className="mb-6">
//             <FloatingLabelInput
//               required
//               label="Name"
//               value={form.data.name}
//               onChange={(e) => form.setData("name", e.target.value)}
//             />
//             {form.errors?.name && <Message message={form.errors?.name} />}
//           </div>

//           <div className="mb-6">
//             <FloatingLabelSelect
//               label="Select a country"
//               value={form.data.country}
//               onValueChange={(e) => form.setData("country", e)}
//               options={countries.map((item) => ({
//                 value: item.name,
//                 label: `${item.flag} ${item.name}`,
//               }))}
//             />
//             {form.errors?.country && <Message message={form.errors?.country} />}
//           </div>

//           <div className="mb-6">
//             <FloatingLabelInput
//               required
//               label="Location"
//               value={form.data.location}
//               onChange={(e) => form.setData("location", e.target.value)}
//             />
//             {form.errors?.location && (
//               <Message message={form.errors?.location} />
//             )}
//           </div>

//           <div className="flex space-x-3 pt-4">
//             <Button block disabled={form.processing}>
//               {warehouse?.id ? "Save changes" : "Submit"}
//             </Button>

//             <Link
//               href={route("web.settings.warehouses.index")}
//               className="block w-full"
//             >
//               <Button variant="outline" block disabled={form.processing}>
//                 Cancel
//               </Button>
//             </Link>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// }
