import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

type FeatureItem = {
  title: string;
  link?: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Basics',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    link: 'docs/category/basics',
    description: (
      <>
        Learn the basics of video engineering, that describes the building blocks of video.
      </>
    ),
  },
  {
    title: 'Advanced',
    link: 'docs/category/advanced',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Explore more advanced topics in video engineering, especially about Television Broadcasting and Streaming.
      </>
    ),
  },
  {
    title: 'Amagi',
    link: 'docs/category/amagi',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Learn about what Amagi is using video engineering for.
      </>
    ),
  },
];

function Feature({title, link, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <Link to={link}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
      </Link>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
