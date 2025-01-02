import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { project_slug } = context.params as { project_slug: string };

    return {
        redirect: {
            destination: `/dashboard/${project_slug}/overview`,
            permanent: false,
        },
    };
};

export default function ProjectIndex() {
    return null; // This component will never render
}