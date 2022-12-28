import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Layout from "../components/layout";
import styles from "../styles/contact.module.css";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import fontawesome from "@fortawesome/fontawesome";
import { faInstagram, faMeta } from "@fortawesome/free-brands-svg-icons";

fontawesome.library.add(faMeta, faInstagram);

export default function Contact() {
  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.contactheader}>Contact Me</h2>
        </div>
        <div className={styles.contactsection}>
          <div className={styles.contactform}>
            <form className={styles.form}>
              <input className={styles.input} type="text" placeholder="Name" />
              <input className={styles.input} type="text" placeholder="Email" />
              <textarea className={styles.input} placeholder="Message" />
              <button className={styles.contactbutton} type="submit">
                Submit
              </button>
            </form>
          </div>
          <div className={styles.social}>
            <Image
              width="120"
              height="120"
              src="/images/myphoto.jpg"
              alt="me"
              className={styles.avatar}
            />
            <div className={styles.link}>
              <div className={styles.icon}>
                <FontAwesomeIcon
                  className={styles.fontawesome}
                  icon="fa-brands fa-meta"
                />
                <p>phil.nguyen.2901</p>
              </div>
              <div className={styles.icon}>
                <FontAwesomeIcon
                  className={styles.fontawesome}
                  icon="fa-brands fa-instagram"
                />
                <p>@philnguyen2901</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
