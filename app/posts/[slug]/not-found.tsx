export async function getNotfoundPostPage() {
  return {
    notFound: true,
    revalidate: false,
  };
}

export async function getHiddenPostPage() {
  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
}