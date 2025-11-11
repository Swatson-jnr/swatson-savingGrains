// import { Client } from "@/types";
// import { Link, useForm } from "@inertiajs/react";
// import { FormEvent } from "react";
// import { Button } from "../ui/button";
// import { FloatingLabelInput } from "../ui/floating-label-input";
// import { FloatingLabelSelect } from "../ui/floating-label-select";
// import { Message } from "../ui/message";

// interface Props {
//   client?: Client;
// }

// export function ClientForm({ client }: Props) {
//   // State
//   const form = useForm({
//     name: client?.name || "",
//     phone_number: client?.phone_number || "",
//     email: client?.email || "",
//     currency: client?.currency || "",
//     credit_limit: client?.credit_limit || "0",
//     weekly_order: client?.weekly_order || "0",
//   });

//   // Methods
//   const onSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     client?.id
//       ? form.patch(route("web.clients.update", client.id))
//       : form.post(route("web.clients.store"));
//   };

//   // Render
//   return (
//     <>
//       <form onSubmit={onSubmit}>
//         <h4 className="mb-5 font-semibold">Enter client details</h4>

//         <div className="mb-6">
//           <FloatingLabelInput
//             label="Name"
//             value={form.data.name}
//             onChange={(e) => form.setData("name", e.target.value)}
//             required
//           />
//           {form.errors?.name && <Message message={form.errors?.name} />}
//         </div>

//         <div className="mb-6">
//           <FloatingLabelInput
//             label="Phone number"
//             value={form.data.phone_number}
//             onChange={(e) => form.setData("phone_number", e.target.value)}
//             required
//           />
//           {form.errors?.phone_number && (
//             <Message message={form.errors?.phone_number} />
//           )}
//         </div>

//         <div className="mb-6">
//           <FloatingLabelInput
//             label="Email"
//             type="email"
//             value={form.data.email}
//             onChange={(e) => form.setData("email", e.target.value)}
//             required
//           />
//           {form.errors?.email && <Message message={form.errors?.email} />}
//         </div>

//         <div className="mb-6">
//           <FloatingLabelSelect
//             label="Currency"
//             value={form.data.currency}
//             placeholder="Select currency"
//             options={[
//               { value: "GHS", label: "GHS" },
//               { value: "KES", label: "KES" },
//             ]}
//             onValueChange={(e) => form.setData("currency", e)}
//             required={true}
//           />
//           {form.errors?.currency && <Message message={form.errors?.currency} />}
//         </div>

//         {/* <div className="mb-6">
//           <FloatingLabelInput
//             label="Credit limit"
//             value={form.data.credit_limit}
//             onChange={(e) => form.setData("credit_limit", e.target.value)}
//             required
//           />
//           {form.errors?.credit_limit && (
//             <Message message={form.errors?.credit_limit} />
//           )}
//         </div>

//         <div className="mb-6">
//           <FloatingLabelInput
//             label="Weekly order"
//             value={form.data.weekly_order}
//             onChange={(e) => form.setData("weekly_order", e.target.value)}
//             required
//           />
//           {form.errors?.weekly_order && (
//             <Message message={form.errors?.weekly_order} />
//           )}
//         </div> */}

//         <div className="flex space-x-3 pt-4">
//           <Button block disabled={form.processing}>
//             {client?.id ? "Save changes" : "Submit"}
//           </Button>

//           <Link href={route("web.clients.index")} className="block w-full">
//             <Button variant="outline" block disabled={form.processing}>
//               Cancel
//             </Button>
//           </Link>
//         </div>
//       </form>
//     </>
//   );
// }
