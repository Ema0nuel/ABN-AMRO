import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { pagesData } from "../../../data/pagesData";
import { SectionRenderer } from "../../../components/sections/SectionRenderer";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import NotFoundPage from "../../admin/main/NotFound";

export function InnerPage() {
  const { slug } = useParams();
  const page = pagesData.find((p) => p.slug === slug);

  if (!page) {
    return <NotFoundPage />;
  }

  // Safe SEO extraction with fallbacks
  const seoTitle =
    page.seo?.title ||
    `${slug.charAt(0).toUpperCase() + slug.slice(1)} | ABN AMRO`;
  const seoDescription =
    page.seo?.description || "Banking services from ABN AMRO.";

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta
          name="keywords"
          content={`${slug}, banking, financial services`}
        />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <canonical href={`${window.location.origin}/${slug}`} />
      </Helmet>

      <div className="min-h-screen bg-primary flex flex-col">
        <Navbar />

        <main className="flex-1">
          {page.sections.map((section, idx) => (
            <SectionRenderer key={idx} section={section} />
          ))}
        </main>

        <Footer />
      </div>
    </>
  );
}
