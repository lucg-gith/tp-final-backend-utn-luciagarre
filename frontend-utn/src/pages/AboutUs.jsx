import Layout from "../components/Layout";

const AboutUs = () => {
  return (
    <Layout>
      <div className="page-banner">Sobre Nosotros</div>

      <section className="page-section">
        <h2>Nuestra Historia</h2>
        <p>
          Somos una librería dedicada a promover la lectura y la cultura
          literaria argentina. Desde nuestros inicios, hemos trabajado para
          acercar los mejores libros a nuestros lectores, con especial énfasis
          en autores argentinos. Creemos que cada libro es una puerta a nuevos
          mundos y experiencias.
        </p>

        <h2>Misión</h2>
        <p>
          Fomentar el amor por la lectura ofreciendo una cuidada selección de
          libros que enriquezcan la vida cultural de nuestra comunidad. Nos
          comprometemos a brindar un espacio donde lectores de todas las edades
          encuentren historias que los inspiren y acompañen.
        </p>

        <h2>Visión</h2>
        <p>
          Convertirnos en la librería de referencia para los amantes de la
          literatura argentina, siendo un puente entre grandes autores y nuevos
          lectores, y contribuyendo al desarrollo cultural de nuestro país.
        </p>
      </section>
    </Layout>
  );
};

export default AboutUs;
