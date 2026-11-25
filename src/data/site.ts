/** Every fact and line of copy below comes from capitalfireandsecurity.ca (harvested 2026-11-25). Nothing invented. */

export const SITE = {
  name: 'Capital Fire & Security',
  legal: 'Capital Fire & Security Inc.',
  tagline: 'Doing what we do best, protecting your building',
  street: '665 Millway Avenue, Unit 52',
  city: 'Concord',
  region: 'Ontario',
  regionShort: 'ON',
  postal: 'L4K 3T8',
  phone: '905-660-0007',
  phoneHref: 'tel:+19056600007',
  fax: '905-660-4197',
  email: 'office@capitalfireandsecurity.ca',
  officeHours: '9 AM to 5 PM, Monday to Friday',
  mapsHref: 'https://maps.google.com/?cid=16706456266617634734',
}

export type Service = {
  slug: string
  short: string
  title: string
  layer: 'cctv' | 'access' | 'fire' | 'intercom' | 'smart' | 'integrated' | 'doors' | 'service'
  img: string
  imgAlt: string
  /** one-liner from their home page tiles */
  card: string
  /** page lead (their H4 under each page title) */
  lead: string
  intro?: string[]
  groups: { title: string; items: string[]; note?: string }[]
  brands: string[]
  extra?: { title: string; body?: string; items?: string[]; img?: string; imgAlt?: string }[]
}

export const SERVICES: Service[] = [
  {
    slug: 'cctv',
    short: 'CCTV',
    title: 'CCTV systems and video surveillance',
    layer: 'cctv',
    img: 'cctv',
    imgAlt: 'Security camera mounted on a concrete wall of a residential building at night',
    card: 'Protect your property from theft and vandalism with a complete camera surveillance system.',
    lead: 'Let Capital Fire & Security Inc. provide solutions to protect your property from vandalism and crime with a complete camera surveillance system that meets site requirements and budgets.',
    groups: [
      { title: 'The system', items: ['A wide selection of fully integrated cameras', '24-hour recording capabilities', 'With our complete system design and multi-camera installation, Capital Fire & Security Inc. is your CCTV solution provider'] },
      { title: 'What we deliver', items: ['Complete CCTV system layouts', 'System retrofit upgrades', '24/7 emergency service', 'Hi-rise, mid-rise, commercial, industrial, hospitality, educational, etc.', 'License plate camera recognition systems'] },
    ],
    brands: ['AXIS Communications', 'Hikvision', 'March Networks', 'Sony', 'Bosch', 'Toshiba', 'Tyco', 'Dahua', 'Panasonic', 'Locomobi'],
  },
  {
    slug: 'access-control',
    short: 'Access control',
    title: 'Access control systems',
    layer: 'access',
    img: 'access',
    imgAlt: 'Hand presenting a key fob to a card reader beside a glass lobby door',
    card: 'Access control is necessary to deter potential risks and provide comprehensive documentation and monitoring.',
    lead: 'Access control is necessary to deter potential risks and provide comprehensive documentation and monitoring of when and where people enter and exit a building.',
    intro: ['Control access for your building. Access Control Systems prevent unauthorized entry by allowing only users with granted credentials into restricted areas.'],
    groups: [
      { title: 'Capital Fire & Security Inc. provides', items: ['Complete system design', 'Installation, supply and service to all types of access control systems', 'We have completed thousands of access control projects from simple single-door to large multiple-site systems', '24/7 emergency services'] },
      { title: 'Benefits of access control systems', items: ['Prevent people from entering secure areas without authorization', 'Document entry/exit times, providing clear auditing capabilities', 'Provide a safer, more secure environment for residents', 'Eliminate the cost of re-keying locks when a tenant leaves', 'Control parking garage access', 'Integrate bluetooth technology of mobile/smartphone credentials', 'Can be networked to provide remote access management'] },
      { title: 'Important access control considerations', items: ['Location and number of suites', 'Number of areas and points to be controlled', 'Building layout', 'Number and turnover of residents', 'Number of visitors and their unique access privileges', 'Internal system management', 'Future building growth', 'Required security levels', 'Integration with additional technology'] },
    ],
    extra: [
      { title: 'Elevator access control', body: 'Capital Fire & Security Inc. offers solutions to monitor building elevator access.', items: ['Limit access to each floor depending on resident credentials', 'Limit access to the elevator cabs', 'Set times for elevator cab operation'], img: 'elevator', imgAlt: 'Card reader beside an elevator call button in a condominium elevator lobby' },
      { title: 'Card technology', items: ['Proximity cards', 'Proximity fobs', 'Smart cards', 'Wireless transmitters', 'Vehicle transponders/UHF tags', 'Smartphone', 'Photo badging'] },
      { title: 'Magnetic locks', body: 'Getting engineered drawings and permits to meet building code requirements can be challenging. Capital Fire & Security Inc. can provide you with a turnkey solution for your Magnetic Lock requirements.', items: ['Engineering drawings', 'Permit application', 'System installation and verification', 'ESA permits and inspections', 'Building and Fire Department final inspections'] },
    ],
    brands: ['ICT', 'SALTO', 'HID', 'ASSA ABLOY', 'Keyscan', 'Condoplex', 'Keri Systems', 'RBH', 'Kantech', 'Mircom', 'Camden'],
  },
  {
    slug: 'fire-life-safety',
    short: 'Fire life safety',
    title: 'Fire life safety systems',
    layer: 'fire',
    img: 'fire',
    imgAlt: 'Fire alarm horn strobe glowing on a wall in an underground parking garage',
    card: 'With complete inspections and 24/7 emergency service, we ensure the best protection for our customers.',
    lead: 'With complete inspections and 24/7 emergency service, we ensure the best possible protection for our customers and their property.',
    groups: [
      { title: 'Fire alarm systems', items: ['24/7 emergency services', 'Inspections: annual, quarterly, monthly', 'System verifications', 'Fire alarm system upgrade', 'Audibility system upgrade', 'Magnetic lock installation and testing', 'Fire extinguishers', 'ULC fire alarm monitoring'] },
      { title: 'Sprinkler systems', items: ['24/7 emergency service', 'System inspections', 'System upgrades', 'System designs'] },
      { title: 'Emergency lighting', items: ['24/7 service', 'System inspections', 'System upgrades', 'Lighting level testing'] },
      { title: 'Fire safety plans', items: ['Preparation', 'Submittal to AHJ'] },
      { title: 'Part 7 testing', note: 'Article 3.2.6.1 of Division “B” of the Building Code', items: ['Engineering', 'Site staff training'] },
      { title: 'Our team', items: ['Fully licensed, factory-trained and certified fire alarm technicians', 'Members of Canadian Fire Alarm Association'] },
    ],
    extra: [
      { title: 'ULC fire alarm monitoring', body: 'Capital Fire & Security Inc. has been a listed ULC authorized monitoring provider for over 25 years. We provide our clients with fire alarm monitoring and ensure code compliance with ULC regulations.' },
    ],
    brands: ['Mircom', 'Honeywell', 'DSC'],
  },
  {
    slug: 'enterphone-intercom',
    short: 'Enterphone and intercom',
    title: 'Enterphone and intercom systems',
    layer: 'intercom',
    img: 'intercom',
    imgAlt: 'Stainless steel entry intercom panel in a condominium vestibule',
    card: 'Enterphone systems provide positive identification and access to your building.',
    lead: 'Capital Fire & Security Inc. supplies and installs intercoms and enterphone systems to provide curb appeal, positive identification and access control at entry doors.',
    intro: ['In today’s hi-rise residential and commercial markets, choosing the right enterphone for your property is imperative to the safety, access and functionality of the building.'],
    groups: [
      { title: 'Why selecting an enterphone matters', items: ['Allow visitors to call residents at the touch of a button', 'Restrict unwanted guests from entering the building', 'Manage parcel delivery', 'Greet guests from anywhere and centralize your concierge'] },
      { title: 'Intercom stations', note: 'Whether you are looking for a two-way call station or an emergency call station, let Capital Fire & Security Inc. provide you with a solution to meet your specific needs.', items: ['Two-way audio stations at the press of a button', 'Two-way audio and video stations at the press of a button', 'Panic/duress stations', 'Nurse call buttons/emergency stations'] },
    ],
    brands: ['ICT', '1VALET', 'Condoplex', 'Aiphone', 'Mircom', 'Linear', 'Door Guard', 'DoorKing', 'Keri Systems', 'Identiv', 'Viking', 'Code Blue'],
  },
  {
    slug: 'smart-buildings',
    short: 'Smart buildings and smart locks',
    title: 'Smart buildings and smart lock entry systems',
    layer: 'smart',
    img: 'smart',
    imgAlt: 'Electronic smart lock with a glowing keypad on a condominium suite door',
    card: 'Smart systems provide convenience and security to your building.',
    lead: 'An entire smart building infrastructure at your fingertips.',
    intro: [
      'In today’s fast-paced environment and with the skyline getting smarter, Capital Fire & Security Inc. continues to lead the way in building integrated security networks and providing the best solutions possible for its customers. We have complete solutions to meet all your needs. Let us create your smart building infrastructure.',
    ],
    groups: [
      { title: 'Smart lock system', note: 'Our smart lock entry systems offer flexibility and ease of use to the end user. They provide a totally wire-free networked electronic locking solution with a great range of features. Our system can help protect commercial, residential, rental, education, healthcare, hospitality, retail, student housing and shared living spaces.', items: [] },
      { title: 'We offer solutions with', items: ['Smart entry systems', 'Parcel and delivery management', 'Resident engagement apps', 'Access control and security cameras', 'Parking management', 'Remote property management'] },
      { title: 'Smart building system', note: 'Smart building technologies have become widely recognized across all generations. We offer solutions that work on a dedicated network to link all technologies together for seamless integration.', items: [] },
    ],
    brands: ['ICT', 'ASSA ABLOY', 'SALTO', 'August', 'Weiser', '1VALET', 'SmartONE', 'Alfred', 'Schlage', 'Honeywell', 'dormakaba'],
  },
  {
    slug: 'integrated-security',
    short: 'Integrated security',
    title: 'Integrated security systems',
    layer: 'integrated',
    img: 'integrated',
    imgAlt: 'Network rack with bundled cables in a building electrical room',
    card: 'Capital Fire & Security Inc. can partner with you to design a scalable integrated security solution that addresses your security challenges.',
    lead: 'Capital Fire & Security Inc. can partner with you to design and implement a scalable integrated security solution to address any security challenge.',
    intro: [
      'Security systems are a vital component of feeling safe and protected, enabling you to effectively monitor all entry and exit points to your property. Capital Fire & Security Inc. prides itself on protecting your investment, infrastructure, inventory, and information.',
      'From physical security hardware to advanced identity management systems, surveillance systems, intercom systems, alarm systems and more, an integrated security system takes multi-layered security systems and integrates them into one robust, efficient and remotely accessible platform.',
    ],
    groups: [
      { title: 'Security systems', items: ['Complete security system design and installation', 'Intrusion protection', 'Detectors', 'Alarms', 'Fully integrated, multi-suite security systems'] },
      { title: 'One platform', items: ['Access control solutions', 'Visitor management software', 'Video surveillance systems', 'Intrusion alarm systems', 'Intercom systems', 'Enterphone systems', 'Door hardware: magnetic locks, electric strikes, keypads and exit devices', '24-hour door monitoring'] },
    ],
    brands: ['1VALET', 'Camden', 'SmartONE', 'ICT', 'Kantech', 'RBH', 'Condoplex', 'Keri Systems', 'SALTO', 'Honeywell', 'DSC'],
  },
  {
    slug: 'automatic-door-operators',
    short: 'Automatic door operators',
    title: 'Automatic door operators',
    layer: 'doors',
    img: 'doors',
    imgAlt: 'Automatic glass lobby door with an accessibility push plate on a post',
    card: 'Capital Fire & Security Inc. offers a variety of automatic door operator systems.',
    lead: 'Capital Fire & Security Inc. has completed thousands of projects involving the supply and installation of automatic door operators.',
    intro: ['Let us offer you a turnkey solution for all your building’s needs. We carry all makes of automatic door operators. Regardless of your type of business or residential building, our solutions will meet the most discerning accessibility standards and help your building meet all building code requirements.'],
    groups: [
      { title: 'We offer', items: ['Supply and installation of automatic door operators', 'Supply and installation of universal washroom kits', 'Supply and installation of touch and/or touchless wave buttons'] },
    ],
    brands: ['Mircom', 'Camden', 'dormakaba', 'Ditec'],
  },
  {
    slug: '24-7-service',
    short: '24/7 service',
    title: '24/7 service',
    layer: 'service',
    img: 'service',
    imgAlt: 'Technician with a tool bag walking down a service corridor at night',
    card: 'The experience and industry expertise necessary to offer 24/7 security solutions for any kind of building and business.',
    lead: 'Capital Fire & Security Inc. works around the clock for your fire life safety and building security systems.',
    intro: ['Capital Fire & Security Inc. provides 24/7 emergency security and fire alarm service. With a 24/7 framework in place, we pride ourselves on servicing all our clients in a timely manner.'],
    groups: [
      { title: 'Contact our office with any questions on our 24/7 service offerings', items: ['Tel: 905-660-0007 (24 hour service line, 7 days a week)', 'Email: office@capitalfireandsecurity.ca, 9 AM to 5 PM, Monday to Friday'] },
    ],
    brands: [],
  },
]

export const svc = (slug: string) => SERVICES.find((s) => s.slug === slug)!

export const NAV = [
  { to: '/about', label: 'Company' },
  { to: '/services', label: 'Services' },
  { to: '/projects', label: 'Projects' },
  { to: '/careers', label: 'Careers' },
  { to: '/contact', label: 'Contact' },
]

export const ABOUT = {
  p1: 'Capital Fire & Security Inc. specializes in all aspects related to fire life safety and building security systems. We offer complete, comprehensive solutions across all your integrated security and fire life safety needs. We are members of the Canadian Fire Alarm Association and the Canadian Security Association.',
  p2: 'With 90 years of combined experience, we offer highly-trained professionals and a proven track record. With access to the industry’s leading technology solutions, we focus on understanding the needs of our customers to ensure prompt and superior customer service at the best possible price. We have completed thousands of security and fire alarm projects ranging from low-rise, to multi-building, high-rise complexes.',
  p3: 'At Capital Fire & Security Inc., our philosophy is to work collaboratively with developers, owners, property managers, general contractors and engineers. We pride ourselves on a reputation of integrity, honesty, and reliability. We are committed to providing high quality, cost-effective and innovative products and solutions that meet the unique demands of our customers.',
  p4: 'Capital Fire & Security Inc. draws from a wide range of products, solutions, and services to protect and facilitate the growth of your business. At Capital Fire & Security Inc., we create solutions that meet the unique security needs of your building.',
  why: [
    'Complete, state-of-the-art fire life safety and security system solutions including design, installation, maintenance, training and software support',
    'Valuable partnerships with leading manufacturers',
    '24/7 emergency services',
    'Industry-leading products from a wide range of manufacturers at the best price',
    'Professional and dedicated staff members are your fire and security partners',
    'Cost-effective solutions',
    'High-quality priority response',
    '90 years of combined experience, supported by exceptional service',
    'Certified technicians and electricians',
    'Fully insured by WSIB',
  ],
  process: [
    { t: 'Assessment', b: 'We start with your building: its layout, its people and the risks you need covered.' },
    { t: 'Design and planning', b: 'A system designed around your requirements and budget, drawn from industry-leading manufacturers.' },
    { t: 'Installation', b: 'Certified technicians and electricians install, verify and hand over a working system.' },
    { t: '24-hour service', b: 'A 24/7 emergency service line, 7 days a week, for as long as the system runs.' },
  ],
  memberships: [
    { f: 'ulc.png', a: 'ULC listed', w: 158, h: 170 },
    { f: 'canasa.png', a: 'Canadian Security Association (CANASA)', w: 415, h: 198 },
    { f: 'esa.png', a: 'Electrical Safety Authority (ESA)', w: 456, h: 236 },
    { f: 'cfaa.png', a: 'Canadian Fire Alarm Association (CFAA)', w: 456, h: 236 },
  ],
}

/** Sector copy from their Portfolio page. */
export const SECTORS = [
  { t: 'High-rise residential and new development', b: 'Capital Fire & Security Inc. is proud to work with some of the best names in development and property management. We pride ourselves in continuing to build relationships and perform with high quality standards of work.', items: ['Fire life safety systems', 'Access control and elevator access', 'Enterphone and intercom', 'CCTV and smart building systems'] },
  { t: 'Commercial, retail and industrial facilities', b: 'Burglary, vandalism, liability, unauthorized entry and external or internal theft are all issues that will highly impact your business. Capital Fire & Security Inc. offers a large range of solutions for all your business security needs.', items: ['Intercom systems', 'Access control systems', 'Video surveillance', 'Real-time control'] },
  { t: 'Government, institutional and educational agencies', b: 'Today’s environments have become challenging and complex. It is key to maintain the high level of security for the safety of children and visitors, and to protect important documents.', items: ['Intercom and door entry systems', 'Security management systems', 'Lockdown security systems', 'Access control systems', 'Security camera systems', 'Alarm systems and monitoring'] },
  { t: 'Hotels and hospitality', b: 'Keeping staff and guests safe is top priority. Preventive maintenance and integration of key security measures is essential to facilitate smooth day-to-day business operation.', items: ['Audio/video intercom and door entry systems', 'Security management systems', '24/7 monitoring services', 'Access control systems', 'Security camera systems', 'Smart lock systems'] },
]

/** Brands shown on their home page, in their order. */
export const BRANDS = ['dormakaba', 'Keyscan', 'ASSA ABLOY', 'DSC', 'Honeywell', 'Sony', 'Bosch', 'Toshiba', 'AXIS Communications', 'HID', 'Schlage', '1VALET', 'SmartONE', 'Alfred', 'August', 'Weiser', 'Kantech', 'RBH', 'Keri Systems', 'Condoplex', 'ICT', 'SALTO', 'March Networks', 'Panasonic', 'Tyco', 'Hikvision', 'Locomobi', 'Camden', 'Dahua', 'Mircom', 'Code Blue', 'Viking', 'Identiv', 'DoorKing', 'Door Guard', 'Aiphone', 'Linear', 'Ditec', 'Norton']

export const JOBS = [
  {
    t: 'Security systems technician',
    type: 'Full-time, permanent',
    resp: ['Install, service, and termination of IP based and analog CCTV systems.', 'Install, service and termination of intercom systems.', 'Install, service and termination of card access systems.', 'Connection of Cat5/Cat6 communication cables.', 'Programming of various security related platforms.', 'Test, adjust and troubleshoot equipment to ensure proper service for all network systems.', 'Interpret electrical drawings, technical bulletins and building plans for proper installation.', 'Work within a team environment that can consist of personnel from multiple trades.'],
    qual: ['Completion of secondary education. Some college and/or technical trade training in electronics or security systems.', 'Experience on large integrated systems, including CCTV, access control, intercom, and intrusion alarm systems.', 'Must be able to interpret technical drawings and schematics.', 'Proficient in computer skills, including MS operating system, office software package and computer usage in security systems.', 'Knowledge of major security product lines and wireless networks.', 'Must have strong interpersonal, communication, and organizational skills.', 'Must have a valid driver’s license and a good driving record.', 'Owning a vehicle is an asset.'],
  },
  {
    t: 'Fire alarm technician',
    type: 'Full-time, permanent',
    lead: 'Requires fire alarm technicians (junior or experienced) with a current CFAA licence to perform installations, maintenance, inspections, testing and verifications of fire alarms within the GTA and surrounding areas.',
    resp: ['Perform monthly and annual fire alarm inspections per CAN/ULC S536-04.', 'Perform verifications of fire alarm systems per CAN/ULC S537-13.', 'Perform fire extinguisher inspections per NFPA-10-2002.', 'Perform fire suppression inspections per current NFPA and OFC standards.', 'Perform emergency lighting inspections per the Ontario Fire Code.', 'Preparation of inspection, verification and deficiency reports in a timely and accurate manner.', 'Service and troubleshoot conventional and addressable fire alarm systems under the supervision of a senior fire protection technician.', 'Required to be on the after-hours on-call rotation.'],
    qual: ['Must have a Canadian Fire Alarm Association certification (CFAA).', '2+ years of experience in the fire protection industry.', 'Diploma in electronics.', 'Intermediate troubleshooting abilities.', 'Excellent computer skills and strong working knowledge of Microsoft Office Suite.', 'Self-motivated individual who can take on a leadership role and work in a fast-paced environment.', 'A valid driver’s license with a clean driving abstract.', 'Employment is predicated on successful completion of an employment background check and a police background check.'],
  },
]

/** Options from their Estimates form. */
export const INTERESTS = ['CCTV systems / video surveillance', 'Access control', 'Fire and life safety', 'Intercom / enterphone systems', 'Integrated security systems', 'Keyless entry systems / smart building', 'Magnetic locks', '24 hour service / alarm monitoring', 'Other']
