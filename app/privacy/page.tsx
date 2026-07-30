import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy · Balzac Antiques",
};

const sections: LegalSection[] = [
  {
    hEn: "1. Scope",
    hFr: "1. Champ d'application",
    pEn: [
      "This policy explains what personal data balzacantiques.ch collects, why, and what your rights are. It applies to browsing the site, creating an account and placing orders. The site is operated by Balzac Antiques ([LEGAL ENTITY NAME], [REGISTERED ADDRESS]).",
    ],
    pFr: [
      "Cette politique explique quelles données personnelles balzacantiques.ch collecte, pourquoi, et quels sont vos droits. Elle s'applique à la navigation sur le site, à la création d'un compte et aux commandes. Le site est exploité par Balzac Antiques ([LEGAL ENTITY NAME], [REGISTERED ADDRESS]).",
    ],
  },
  {
    hEn: "2. Data we collect",
    hFr: "2. Données collectées",
    pEn: [
      "Account: your name, email address and a password, which is stored only in encrypted (hashed) form. Orders: the pieces ordered, your delivery address and an optional phone number. Preferences such as language and display currency are stored on your own device, not on our servers.",
      "We do not collect or store payment card details. Payments are handled by the payment provider under its own privacy policy.",
    ],
    pFr: [
      "Compte : votre nom, votre adresse e-mail et un mot de passe, conservé uniquement sous forme chiffrée (hachée). Commandes : les pièces commandées, votre adresse de livraison et un numéro de téléphone facultatif. Les préférences comme la langue et la devise d'affichage sont stockées sur votre propre appareil, pas sur nos serveurs.",
      "Nous ne collectons ni ne conservons de données de carte bancaire. Les paiements sont traités par le prestataire de paiement selon sa propre politique de confidentialité.",
    ],
  },
  {
    hEn: "3. How we use your data",
    hFr: "3. Utilisation de vos données",
    pEn: [
      "Your data is used to operate your account, process and deliver your orders, contact you about them, and meet legal obligations such as accounting. We do not sell your data and we do not use it for third-party advertising.",
    ],
    pFr: [
      "Vos données servent à gérer votre compte, à traiter et livrer vos commandes, à vous contacter à leur sujet et à respecter nos obligations légales, notamment comptables. Nous ne vendons pas vos données et ne les utilisons pas pour de la publicité tierce.",
    ],
  },
  {
    hEn: "4. Cookies",
    hFr: "4. Cookies",
    pEn: [
      "The site uses only essential cookies: a session cookie that keeps you signed in to your account. There are no advertising or cross-site tracking cookies.",
    ],
    pFr: [
      "Le site n'utilise que des cookies essentiels : un cookie de session qui vous maintient connecté à votre compte. Il n'y a aucun cookie publicitaire ni de suivi entre sites.",
    ],
  },
  {
    hEn: "5. Sharing",
    hFr: "5. Partage",
    pEn: [
      "Your data is shared only where needed to fulfil an order: with the shipping carrier (name, delivery address, phone) and with the payment provider when you pay. It is not shared with anyone else except where the law requires it.",
    ],
    pFr: [
      "Vos données ne sont partagées que lorsque c'est nécessaire à l'exécution d'une commande : avec le transporteur (nom, adresse de livraison, téléphone) et avec le prestataire de paiement lors du règlement. Elles ne sont transmises à personne d'autre, sauf obligation légale.",
    ],
  },
  {
    hEn: "6. Storage and security",
    hFr: "6. Conservation et sécurité",
    pEn: [
      "Data is stored on the gallery's own server. Connections to the site are encrypted (HTTPS), passwords are stored hashed, and access to order data is restricted to the gallery. Order records are kept as long as required for legal and accounting purposes.",
    ],
    pFr: [
      "Les données sont conservées sur le serveur de la galerie. Les connexions au site sont chiffrées (HTTPS), les mots de passe sont conservés hachés et l'accès aux données de commande est réservé à la galerie. Les commandes sont conservées aussi longtemps que l'exigent les obligations légales et comptables.",
    ],
  },
  {
    hEn: "7. Your rights",
    hFr: "7. Vos droits",
    pEn: [
      "You may ask at any time to access, correct or delete the personal data we hold about you, subject to records we must keep by law. Saved addresses can be edited or deleted directly in your account. For anything else, contact the gallery via the Contact page.",
    ],
    pFr: [
      "Vous pouvez à tout moment demander l'accès, la rectification ou la suppression des données personnelles que nous détenons à votre sujet, sous réserve des registres que la loi nous impose de conserver. Les adresses enregistrées se modifient ou se suppriment directement dans votre compte. Pour toute autre demande, contactez la galerie via la page Contact.",
    ],
  },
  {
    hEn: "8. Changes",
    hFr: "8. Modifications",
    pEn: [
      "If this policy changes, the new version will be published on this page. Significant changes affecting account holders will be communicated by email.",
    ],
    pFr: [
      "En cas de modification de cette politique, la nouvelle version sera publiée sur cette page. Les changements importants concernant les titulaires de compte seront communiqués par e-mail.",
    ],
  },
];

export default function PrivacyPage() {
  return <LegalPage titleEn="Privacy Policy" titleFr="Politique de confidentialité" sections={sections} />;
}
