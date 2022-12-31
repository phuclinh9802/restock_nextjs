import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Layout from "../components/layout";
import styles from "../styles/Home.module.css";
import React from "react";

export default function Home() {
  return (
    <Layout>
      <div className={styles.hero}>
        <h2>Where your researching journey begins</h2>
        <p>
          A simple app to search for your favorite stocks using Financial
          Modeling Prep and Polygon.io API
        </p>
        <Link href="/search" passHref legacyBehavior>
          <a className={styles.startbutton}>Get Started</a>
        </Link>
      </div>
    </Layout>
  );
}
