import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3 className="footer-title">XFlow</h3>
            <p className="footer-description">
              Simplifiez la gestion de vos projets et boostez la productivité de votre équipe.
            </p>
          </div>
          <div className="footer-section">
            <h4 className="footer-heading">Produit</h4>
            <ul className="footer-list">
              <li><a href="#">Fonctionnalités</a></li>
              <li><a href="#">Tarifs</a></li>
              <li><a href="#">Guide d'utilisation</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="footer-heading">Entreprise</h4>
            <ul className="footer-list">
              <li><a href="#">À propos</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Carrières</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="footer-heading">Suivez-nous</h4>
            <div className="footer-social">
              <a href="#"><Github className="icon" /></a>
              <a href="#"><Twitter className="icon" /></a>
              <a href="#"><Linkedin className="icon" /></a>
              <a href="#"><Mail className="icon" /></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">© 2025 XFlow. Tous droits réservés.</p>
          <div className="footer-links">
            <a href="#">Politique de confidentialité</a>
            <a href="#">Conditions d'utilisation</a>
            <a href="#">Mentions légales</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;