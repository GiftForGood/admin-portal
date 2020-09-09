import useUser from '@components/session/modules/useUser';

const Verified = (props) => {
  const user = useUser();

  // Admin
  if (user.admin && user.emailVerified) {
    return props.children({
      isDisabled: false,
    });
  }

  return props.children({
    isDisabled: true,
  });
};

export default Verified;
