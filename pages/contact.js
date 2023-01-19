import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Layout from "../components/layout";
import styles from "../styles/contact.module.css";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import fontawesome from "@fortawesome/fontawesome";
import {
  faInstagram,
  faMeta,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

fontawesome.library.add(faMeta, faInstagram, faLinkedin);

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sending");

    let data = {
      name,
      email,
      message,
    };

    fetch("/api/contact", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      console.log("Response received");
      if (res.status === 200) {
        console.log("Response succeeded!");
        setSubmitted(true);
        setName("");
        setEmail("");
        setMessage("");
      }
    });
  };
  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.contactheader}>Contact Me</h2>
        </div>
        <div className={styles.contactsection}>
          <div className={styles.contactform}>
            {!submitted ? (
              <form
                className={styles.form}
                onSubmit={(e) => {
                  handleSubmit(e);
                }}
                method="post"
              >
                <input
                  className={styles.input}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  type="text"
                  placeholder="Name"
                />
                <input
                  className={styles.input}
                  type="text"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  placeholder="Email"
                />
                <textarea
                  className={styles.input}
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                  placeholder="Message"
                />
                <input className={styles.contactbutton} type="submit" />
              </form>
            ) : (
              <h2 className={styles.appreciation}>
                Thank you for your messages! I hope to contact with you someday
                :D !
              </h2>
            )}
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
                <p>@phil.nguyen.2901</p>
              </div>
              <div className={styles.icon}>
                <FontAwesomeIcon
                  className={styles.fontawesome}
                  icon="fa-brands fa-instagram"
                />
                <p>@philnguyen2901</p>
              </div>
              <div className={styles.icon}>
                <FontAwesomeIcon
                  className={styles.fontawesome}
                  icon="fa-brands fa-linkedin"
                />
                <p>@philswe</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
