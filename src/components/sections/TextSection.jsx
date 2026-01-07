import { motion } from "framer-motion";

export function TextSection({ content, alignment = "left" }) {
  return (
    <section className="py-16 sm:py-24 bg-primary">
      <div className="container mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`text-lg sm:text-xl leading-relaxed text-secondary ${
            alignment === "center" ? "text-center" : "text-left"
          }`}
        >
          {content}
        </motion.div>
      </div>
    </section>
  );
}
