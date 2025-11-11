// import { FormEvent } from "react";
// import { When } from "react-if";
// import { Entity } from "../../types";
// import { Button } from "../ui/button";
// import { FloatingLabelInput } from "../ui/floating-label-input";
// // import { FloatingLabelSelect } from "../ui/floating-label-select";
// import { Message } from "../ui/message";
// import { FloatingLabelSelect } from "../ui/floating-label-select";

// interface Props {
//   aggregator?: Entity;
// }

// export function AggregatorForm({ aggregator }: Props) {
//   // State
//   const form = useForm({
//     name: aggregator?.name || "",
//     phone_number: aggregator?.phone_number || "",
//     mobile_network: aggregator?.mobile_network || "",
//     gender: aggregator?.gender || "",
//     type: "AGGREGATOR",
//   });

//   // Methods
//   const onSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     aggregator?.id
//       ? form.patch(route("web.settings.aggregators.update", aggregator?.id))
//       : form.post(route("web.settings.aggregators.store"));
//   };

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
//             <FloatingLabelInput
//               label="Phone number"
//               value={form.data.phone_number}
//               onChange={(e) => form.setData("phone_number", e.target.value)}
//               required
//             />
//             {form.errors?.phone_number && (
//               <Message message={form.errors?.phone_number} />
//             )}
//           </div>

//           <div className="mb-6">
//             <FloatingLabelSelect
//               label="Gender"
//               required
//               value={form.data.gender}
//               onValueChange={(v) => form.setData("gender", v)}
//               options={[
//                 { value: "MALE", label: "Male" },
//                 { value: "FEMALE", label: "Female" },
//               ]}
//             />

//             <When condition={form.errors.gender}>
//               <Message className="text-red-500">{form.errors.gender}</Message>
//             </When>
//           </div>

//           <div className="mb-6">
//             <FloatingLabelSelect
//               label="Mobile network"
//               required
//               value={form.data.mobile_network}
//               onValueChange={(v) => form.setData("mobile_network", v)}
//               options={[
//                 { value: "MTN", label: "MTN" },
//                 { value: "SAFARICOM", label: "SAFARICOM" },
//               ]}
//             />

//             <When condition={form.errors.mobile_network}>
//               <Message className="text-red-500">
//                 {form.errors.mobile_network}
//               </Message>
//             </When>
//           </div>

//           <div className="flex space-x-3 pt-4">
//             <Button block disabled={form.processing}>
//               {aggregator?.id ? "Save changes" : "Submit"}
//             </Button>

//             <Link
//               href={route("web.settings.aggregators.index")}
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
