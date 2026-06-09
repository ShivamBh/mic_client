import DonatePage from './DonateHome';
import HandAnimPic from '../assets/hand_animation.gif';
import DownArrow from '../assets/down.svg';
import '../styles/ui.css';
import handIcon from '../assets/handicon.png';

function DonateMobile() {
  return (
    <>
      <section className="hand-animation">
        <img className="hand-anim" src={HandAnimPic} alt="hand anim" />
        {/* <video
              src={HandAnim}
              autoPlay
              loop
              aria-label="hand animation loop"
              height={200}
              width={200}
            ></video> */}
        {/* <img className="down-arrow" src={DownArrow} alt="" /> */}
      </section>
      <section className="donation">
        <div className="donate-heading">
          <h2>Donate</h2>
        </div>
        <div className="donate-subheading">
          <p>
            25 cents buys 10 minutes of rest. There is no tax receipt — this isn't a nonprofit, it's
            an art project. You will receive a signed certificate of donation.
          </p>
          <p>
            For questions about donations contact
            <a href="mailto:someone@example.com"> studio@tarakelton.com</a>. Funds are disbursed to
            workers daily.
          </p>
        </div>
        <div className="checkout-form">
          <DonatePage />
        </div>
      </section>
      <footer className="mhm-footer">
        <div className="mhm-footer-bottom">
          <img src={handIcon} alt="" className="mhm-hand-icon" />
          <span>
            ©{' '}
            <a
              href="https://tarakelton.com"
              target="_blank"
              rel="noreferrer"
              className="credit-link"
            >
              Tara Kelton
            </a>{' '}
            2026
          </span>
        </div>
      </footer>
    </>
  );
}

export default DonateMobile;
