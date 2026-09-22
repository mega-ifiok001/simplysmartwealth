export async function getNotfoundCategoryPage() {
  return {
    notFound: true,
    revalidate: false,
  };
}