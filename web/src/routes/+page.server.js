export const actions = {
    upload: async ({ request }) => {
      const formData = await request.formData();
      console.log(formData)
      return { success: true };
    },
  };