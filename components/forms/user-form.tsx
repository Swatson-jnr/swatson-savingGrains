// import { formatDate } from "@/lib/utils";
// import type { Country, Role, User, Warehouse } from "@/types";
// import { Link, useForm } from "@inertiajs/react";
// import dayjs from "dayjs";
// import { parsePhoneNumber, type CountryCode } from "libphonenumber-js";
// import { useState, type FormEvent } from "react";
// import "flatpickr/dist/flatpickr.min.css";
// import { When } from "react-if";
// import { toast } from "sonner";
// import { PhoneNumberInput } from "../phone-number-input";
// import { Button } from "../ui/button";
// import { FloatingLabelDateInput } from "../ui/floating-label-date-input";
// import { FloatingLabelInput } from "../ui/floating-label-input";
// import { FloatingLabelSelect } from "../ui/floating-label-select";
// import { Label } from "../ui/label";
// import { Message } from "../ui/message";
// import { MultiSelect, Option } from "../ui/multi-select";

// type Props = {
//   countries: Array<Country>;
//   user?: User;
//   roles: Array<Role>;
//   warehouses: Array<Warehouse>;
// };

// type Form = {
//   first_name: string;
//   last_name: string;
//   phone_number: string;
//   mobile_network: string;
//   date_of_birth: string;
//   roles: Array<string>;
//   gender: string;
//   status: string;
//   warehouses: Array<string>;
//   assigned_countries: Array<string>;
// };

// export function UserForm(props: Props) {
//   const { user, roles, warehouses } = props;
//   const [country, setCountry] = useState("GH");
//   const [selectedWarehouses, setSelectedWarehouses] = useState<Array<Option>>(
//     user?.warehouses
//       ? user?.warehouses
//           ?.filter((item) => !item.is_storehouse)
//           ?.map((item) => ({ value: item.id, label: item.name }))
//       : [],
//   );
//   const [assignedCountries, setAssignedCountries] = useState<Array<Option>>(
//     user?.assigned_countries
//       ? user?.assigned_countries?.map((item) => ({
//           value: item,
//           label: item,
//         }))
//       : [],
//   );
//   const [selectedRoles, setSelectedRoles] = useState<Array<Option>>(
//     user?.roles
//       ? user?.roles?.map((item) => ({
//           value: item.name,
//           label: item.display_name,
//         }))
//       : [],
//   );
//   const { data, setData, post, patch, transform, processing, errors, ...form } =
//     useForm<Form>({
//       first_name: user?.first_name ?? "",
//       last_name: user?.last_name ?? "",
//       phone_number: user?.phone_number ?? "",
//       mobile_network: user?.mobile_network ?? "",
//       date_of_birth:
//         user?.date_of_birth ?? formatDate(dayjs().subtract(18, "year")),
//       roles: selectedRoles.map((item) => item.value),
//       gender: user?.gender ?? "MALE",
//       status: user?.status ?? "ACTIVE",
//       warehouses: selectedWarehouses.map((item) => item.value),
//       assigned_countries: assignedCountries.map((item) => item.value),
//     });

//   // Methods
//   const onSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     try {
//       const parsed = parsePhoneNumber(
//         data.phone_number,
//         country as CountryCode,
//       );

//       const request = {
//         ...data,
//         phone_number: parsed.number.replaceAll(" ", ""),
//       };

//       transform(() => ({ ...request }));

//       user?.id
//         ? patch(route("web.settings.users.update", { id: user?.id }))
//         : post(route("web.settings.users.store"));
//     } catch (error) {
//       toast.error((error as Error).message, { closeButton: true });
//     }
//   };

//   return (
//     <div className="w-full max-w-md">
//       <form onSubmit={onSubmit}>
//         <div className="row">
//           <div className="col-1 lg:col-12">
//             <div className="mb-6">
//               <FloatingLabelInput
//                 label="First name"
//                 required
//                 value={data.first_name}
//                 onChange={(e) => setData("first_name", e.target.value)}
//               />
//               <When condition={errors.first_name}>
//                 <Message className="text-red-500">{errors.first_name}</Message>
//               </When>
//             </div>
//           </div>

//           <div className="col-1 lg:col-12">
//             <div className="mb-6">
//               <FloatingLabelInput
//                 label="Last name"
//                 required
//                 value={data.last_name}
//                 onChange={(e) => setData("last_name", e.target.value)}
//               />
//               <When condition={errors.last_name}>
//                 <Message className="text-red-500">{errors.last_name}</Message>
//               </When>
//             </div>
//           </div>

//           <div className="col-1 lg:col-12">
//             <div className="mb-6">
//               <FloatingLabelDateInput
//                 label="Date of Birth"
//                 value={data.date_of_birth}
//                 onChange={([d]) => {
//                   setData("date_of_birth", formatDate(d));
//                 }}
//               />
//               <When condition={errors.date_of_birth}>
//                 <Message className="text-red-500">
//                   {errors.date_of_birth}
//                 </Message>
//               </When>
//             </div>
//           </div>

//           <div className="col-1 lg:col-12">
//             <div className="mb-6">
//               <PhoneNumberInput
//                 type="tel"
//                 label="Phone Number"
//                 value={data.phone_number}
//                 country={country}
//                 setCountry={setCountry}
//                 onChange={(e) => setData("phone_number", e.target.value)}
//               />

//               <When condition={errors.phone_number}>
//                 <Message className="text-red-500">
//                   {errors.phone_number}
//                 </Message>
//               </When>
//             </div>
//           </div>

//           <div className="col-1 lg:col-12">
//             <div className="mb-6">
//               <FloatingLabelSelect
//                 label="Status"
//                 required
//                 value={data.status}
//                 onValueChange={(v) => setData("status", v)}
//                 options={[
//                   { value: "ACTIVE", label: "Active" },
//                   { value: "INACTIVE", label: "Inactive" },
//                   { value: "ARCHIVED", label: "Archived" },
//                 ]}
//               />

//               <When condition={errors.status}>
//                 <Message className="text-red-500">{errors.status}</Message>
//               </When>
//             </div>
//           </div>

//           <div className="col-1 lg:col-12">
//             <div className="mb-6">
//               <FloatingLabelSelect
//                 label="Gender"
//                 required
//                 value={data.gender}
//                 onValueChange={(v) => setData("gender", v)}
//                 options={[
//                   { value: "MALE", label: "Male" },
//                   { value: "FEMALE", label: "Female" },
//                 ]}
//               />

//               <When condition={errors.gender}>
//                 <Message className="text-red-500">{errors.gender}</Message>
//               </When>
//             </div>
//           </div>

//           <div className="col-1 lg:col-12">
//             <div className="mb-6">
//               <div className="relative">
//                 <Label
//                   className={`pointer-events-none absolute -top-2 left-1 z-10 bg-background px-2 text-xs text-gray-500 transition-all duration-200`}
//                 >
//                   Role(s)
//                 </Label>

//                 <MultiSelect
//                   options={roles.map((item) => ({
//                     label: item.display_name,
//                     value: item.name,
//                   }))}
//                   value={selectedRoles}
//                   onChange={(v) => {
//                     setSelectedRoles(v);
//                     setData(
//                       "roles",
//                       v.map((item) => item.value),
//                     );
//                     form.setError("roles", "");
//                   }}
//                   placeholder="Select..."
//                 />
//               </div>

//               <When condition={errors.roles}>
//                 <Message className="text-red-500">{errors.roles}</Message>
//               </When>
//             </div>
//           </div>

//           {/* <div className="col-1 lg:col-12">
//             <div className="mb-6">
//               <FloatingLabelSelect
//                 label="Role"
//                 required
//                 value={data.roles}
//                 onValueChange={(v) => setData("roles", v)}
//                 options={roles.map((item) => ({
//                   value: item.name,
//                   label: item.display_name,
//                 }))}
//               />

//               <When condition={errors.role}>
//                 <Message className="text-red-500">{errors.role}</Message>
//               </When>
//             </div>
//           </div> */}

//           {data.roles.includes("STOCK_MANAGER") && (
//             <div className="col-1 lg:col-12">
//               <div className="mb-6">
//                 <div className="relative">
//                   <Label
//                     className={`pointer-events-none absolute -top-2 left-1 z-10 bg-background px-2 text-xs text-gray-500 transition-all duration-200`}
//                   >
//                     Warehouse(s)
//                   </Label>

//                   <MultiSelect
//                     options={warehouses.map((item) => ({
//                       label: item.name,
//                       value: item.id,
//                     }))}
//                     value={selectedWarehouses}
//                     onChange={(v) => {
//                       setSelectedWarehouses(v);
//                       setData(
//                         "warehouses",
//                         v.map((item) => item.value),
//                       );
//                       form.setError("warehouses", "");
//                     }}
//                     placeholder="Select..."
//                   />
//                 </div>

//                 <When condition={errors.warehouses}>
//                   <Message className="text-red-500">
//                     {errors.warehouses}
//                   </Message>
//                 </When>
//               </div>
//             </div>
//           )}

//           <div className="col-1 lg:col-12">
//             <div className="mb-6">
//               <div className="relative">
//                 <Label
//                   className={`pointer-events-none absolute -top-2 left-1 z-10 bg-background px-2 text-xs text-gray-500 transition-all duration-200`}
//                 >
//                   Assigned countries
//                 </Label>

//                 <MultiSelect
//                   options={["Ghana", "Kenya"].map((item) => ({
//                     label: item,
//                     value: item,
//                   }))}
//                   value={assignedCountries}
//                   onChange={(v) => {
//                     setAssignedCountries(v);
//                     setData(
//                       "assigned_countries",
//                       v.map((item) => item.value),
//                     );
//                     form.setError("assigned_countries", "");
//                   }}
//                   placeholder="Select..."
//                 />
//               </div>

//               <When condition={errors.assigned_countries}>
//                 <Message className="text-red-500">
//                   {errors.assigned_countries}
//                 </Message>
//               </When>
//             </div>
//           </div>
//         </div>

//         {/* <div className="mb-5">
//                 <Label>Mobile Network</Label>
//                 <Input
//                   required
//                   value={data.mobile_network}
//                   onChange={(e) => setData("mobile_network", e.target.value)}
//                 />
//                 <When condition={errors.mobile_network}>
//                   <Message className="text-red-500">
//                     {errors.mobile_network}
//                   </Message>
//                 </When>
//               </div> */}

//         <div className="flex space-x-3 pt-4">
//           <Button block disabled={processing}>
//             {user?.id ? "Save changes" : "Submit"}
//           </Button>

//           <Link
//             href={route("web.settings.users.index")}
//             className="block w-full"
//           >
//             <Button variant="outline" block disabled={processing}>
//               Cancel
//             </Button>
//           </Link>
//         </div>
//       </form>
//     </div>
//   );
// }
