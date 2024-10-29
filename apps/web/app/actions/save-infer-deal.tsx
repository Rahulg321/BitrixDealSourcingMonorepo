"use server";

export default async function SaveInferredDeal({
  generation,
}: {
  generation: string;
}) {
  try {
    const parsedDeal = await JSON.parse(generation);
    console.log(parsedDeal);
    return {
      type: "success",
      message: "Deal saved successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      type: "error",
      message: "Something went wrong",
    };
  }
}
