export default function FinalCta() {
  return (
    <section
      id='contact'
      className='flex flex-col items-center w-full gap-8 bg-black p-[120px]'>
      <h2 className='font-instrument text-[52px] italic text-white text-center font-normal'>
        Begin Your Journey
      </h2>
      <p className='font-inter text-[18px] text-[#CCCCCC] text-center leading-[1.6] w-[700px] font-normal'>
        Visit our showroom or schedule a personal consultation with our design
        team
      </p>
      <button className='bg-white py-4 px-8'>
        <span className='font-inter text-[14px] font-medium text-black'>
          Schedule Consultation
        </span>
      </button>
    </section>
  );
}
