/**
 * Server-side email validation.
 * Checks format, role-based addresses, and known disposable/throwaway domains.
 */

export type EmailValidationResult =
  | { valid: true }
  | { valid: false; reason: 'invalid_format' | 'role_address' | 'disposable_email' | 'invalid_domain' }

/** Basic RFC-5322 simplified regex — rejects the most common typos and malformed inputs */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/

/** Role-based prefixes that indicate shared/functional mailboxes (not real leads) */
const ROLE_PREFIXES = new Set([
  'admin', 'administrator', 'billing', 'contact', 'hello', 'help',
  'hostmaster', 'info', 'it', 'legal', 'mail', 'marketing', 'noreply',
  'no-reply', 'notifications', 'postmaster', 'privacy', 'root',
  'sales', 'security', 'spam', 'support', 'sysadmin', 'team',
  'tech', 'test', 'webmaster', 'www',
])

/** Known disposable/throwaway email domains — sourced from public blocklists */
const DISPOSABLE_DOMAINS = new Set([
  '0-mail.com', '0815.ru', '0clickemail.com', '0wnd.net', '0wnd.org',
  '10mail.org', '10minutemail.com', '10minutemail.net', '10minutemail.org',
  '10minutemail.de', '10minutemail.us', '10minutemail.co.uk',
  '20minutemail.com', '33mail.com',
  'anonbox.net', 'antispam.de', 'armyspy.com',
  'binkmail.com', 'boun.cr', 'breakthru.com', 'burnermail.io',
  'byom.de',
  'cfl.fr', 'chacuo.net', 'chammy.info', 'cheatmail.de',
  'clrmail.com', 'crazymailing.com', 'cuvox.de',
  'dayrep.com', 'deadaddress.com', 'despam.it', 'discard.email',
  'discardmail.com', 'discardmail.de', 'disposableaddress.com',
  'disposableinbox.com', 'disposablemail.ml', 'dodgit.com', 'donemail.ru',
  'drdrb.com', 'dump-email.info', 'dumpmail.de', 'dumpyemail.com',
  'e4ward.com', 'einrot.com', 'emailisvalid.com', 'emailfake.com',
  'emailfake.ml', 'emailhippo.com', 'emailinfive.com', 'emailisvalid.com',
  'emailna.co', 'emailondeck.com', 'emailsensei.com', 'emailtemporanea.com',
  'emailtemporanea.net', 'emailtemporario.com.br', 'emailthe.net',
  'emailtmp.com', 'emailwarden.com', 'emailx.at.hm',
  'emkei.cz', 'emkei.ga', 'emkei.gq', 'emkei.ml', 'emkei.tk',
  'evilcomputers.net', 'explodemail.com',
  'fake-email.pp.ua', 'fakeinbox.com', 'fakeinformation.com', 'fakermail.com',
  'fakemail.fr', 'fakemailgenerator.com', 'fammix.com', 'fansworldwide.de',
  'filzmail.com', 'flyinggeek.net', 'frapmail.com',
  'garliclife.com', 'get1mail.com', 'getairmail.com', 'getonemail.com',
  'getonemail.net', 'girlsundertheinfluence.com', 'gishpuppy.com',
  'gowikibooks.com', 'gowikicampus.com', 'gowikicars.com',
  'grr.la', 'gsrv.co.uk', 'guerillamail.biz', 'guerillamail.com',
  'guerillamail.de', 'guerillamail.net', 'guerillamail.org', 'guerillamail.info',
  'guerrillamail.biz', 'guerrillamail.com', 'guerrillamail.de',
  'guerrillamail.net', 'guerrillamail.org', 'guerrillamailblock.com',
  'gustr.com',
  'h8s.org', 'haltospam.com', 'has.dating',
  'hidemail.de', 'hidzz.com', 'hmamail.com', 'hopemail.biz',
  'hot-mail.online', 'hushmail.com',
  'imails.info', 'inboxalias.com', 'inboxclean.com', 'inboxclean.org',
  'incognitomail.com', 'incognitomail.net', 'incognitomail.org',
  'inoutmail.de', 'inoutmail.eu', 'inoutmail.info', 'inoutmail.net',
  'internet-e-mail.de', 'internet-mail.org', 'internetemails.net',
  'internetmailing.net', 'inwind.it', 'iozak.com',
  'irish2me.com', 'is.af', 'iwi.net',
  'jetable.com', 'jetable.fr.nf', 'jetable.net', 'jetable.org',
  'jnxjn.com', 'jourrapide.com', 'jsrsolutions.com',
  'justemail.net', 'junk1.com',
  'kasmail.com', 'kasi-jetzt-einkaufen.de', 'kcks.com',
  'keepmymail.com', 'klzlk.com', 'koszmail.pl', 'kurzepost.de',
  'letthemeatspam.com', 'limemail.com', 'lol.ovpn.to',
  'lookugly.com', 'lortemail.dk',
  'mail-filter.com', 'mail-temporaire.com', 'mail-temporaire.fr',
  'mail.mezimages.net', 'mailbidon.com', 'mailblocks.com', 'mailbucket.org',
  'mailcat.biz', 'mailcatch.com', 'maildrop.cc', 'maileimer.de',
  'mailexpire.com', 'mailf5.com', 'mailfall.com', 'mailfence.com',
  'mailforspam.com', 'mailfreeonline.com', 'mailfs.com', 'mailguard.me',
  'mailimate.com', 'mailin8r.com', 'mailinater.com', 'mailinator.com',
  'mailinator.net', 'mailinator.org', 'mailinator2.com', 'mailincubator.com',
  'mailismagic.com', 'mailjunk.cf', 'mailjunk.eu', 'mailjunk.ga',
  'mailjunk.gq', 'mailjunk.ml', 'mailmate.com', 'mailme.ir',
  'mailme24.com', 'mailmetrash.com', 'mailmoat.com', 'mailnew.com',
  'mailnull.com', 'mailplume.com', 'mailpoof.com', 'mailproxsy.com',
  'mailrock.biz', 'mailscrap.com', 'mailshell.com', 'mailsiphon.com',
  'mailslapping.com', 'mailslite.com', 'mailsiphon.com',
  'mailspam.me', 'mailspam.xyz', 'mailtemp.info', 'mailtome.de',
  'mailtrash.net', 'mailtrix.net', 'mailwithyou.com', 'mailzilla.com',
  'mailzilla.org', 'makemetheking.com', 'manybrain.com',
  'mbx.cc', 'mega.zik.dj', 'meltmail.com', 'messagebeamer.de',
  'mintemail.com', 'mobileninja.co.uk', 'mohmal.com', 'moakt.com',
  'moncourrier.fr.nf', 'monemail.fr.nf', 'monmail.fr.nf',
  'mozej.com', 'msft.cloudns.cl', 'mt2009.com',
  'mybox.it', 'mycorneroftheinter.net', 'myfastmail.com',
  'mymailoasis.com', 'mynetstore.de', 'myopera.com', 'myspaceinc.com',
  'myspacepimpedup.com', 'myspamless.com', 'mytemp.email', 'mytempemail.com',
  'mytempmail.com', 'mytrashmail.com',
  'nearlyfreespeech.net', 'netzidiot.de', 'neverbox.com',
  'nice-four.com', 'no-spam.ws', 'nobulk.com', 'noclickemail.com',
  'nogmailspam.info', 'nomorespamemails.com', 'nonspam.eu',
  'noref.in', 'nospam.ze.tc', 'nospam4.us', 'nospamfor.us',
  'nospammail.net', 'nospamthanks.info', 'notmailinator.com',
  'notsharingmy.info', 'nowmymail.com',
  'obobbo.com', 'odnorazovoe.ru', 'ohaaa.de', 'oneoffemail.com',
  'onewaymail.com', 'onlatedotcom.info', 'oo.gl', 'oopi.org',
  'opentrash.com', 'ordinaryamerican.net', 'owlpic.com',
  'parlimentpetitioner.tk', 'patchala.net', 'pepbot.com',
  'pia.com', 'pjjkp.com', 'plexolan.de', 'politikerclub.de',
  'poofy.org', 'pookmail.com', 'pops.com', 'postacin.com',
  'privacy.net', 'proxymail.eu', 'prtnx.com', 'prtz.eu',
  'put2.net', 'putthisinyourspamdatabase.com',
  'qq.com', 'quickinbox.com',
  'rcpt.at', 'recode.me', 'recursor.net',
  'reggae.fm', 'rklips.com', 'rmqkr.net',
  'royal.net', 'rppkn.com', 'rtrtr.com',
  's0ny.net', 'safe-mail.net', 'safersignup.de',
  'safetymail.info', 'safetypost.de', 'santanandmail.com',
  'sendspamhere.com', 'sharklasers.com',
  'shiftmail.com', 'shitmail.de', 'shitmail.me', 'shitmail.org',
  'shitware.nl', 'shmeriously.com', 'shotgun.hu', 'showslow.de',
  'sinnlos-mail.de', 'sivtmwiesewcr.com', 'slipry.net',
  'smellfear.com', 'snakemail.com', 'sneakemail.com',
  'snkmail.com', 'sofimail.com', 'sofort-mail.de', 'sogetthis.com',
  'spam.la', 'spam.org.tr', 'spam.su', 'spam4.me',
  'spamail.de', 'spamarrest.com', 'spamavert.com', 'spambob.com',
  'spambob.net', 'spambob.org', 'spambog.com', 'spambog.de',
  'spambog.ru', 'spambox.info', 'spambox.us', 'spamcannon.com',
  'spamcannon.net', 'spamcero.com', 'spamcon.org', 'spamcorptastic.com',
  'spamcowboy.com', 'spamcowboy.net', 'spamcowboy.org',
  'spamday.com', 'spamex.com', 'spamfree.eu', 'spamfree24.de',
  'spamfree24.eu', 'spamfree24.info', 'spamfree24.net', 'spamfree24.org',
  'spamgoes.in', 'spamgourmet.com', 'spamgourmet.net', 'spamgourmet.org',
  'spamherelots.com', 'spamherelots.com', 'spamhereplease.com',
  'spamhole.com', 'spamify.com', 'spaminator.de', 'spamkill.info',
  'spaml.com', 'spaml.de', 'spammotel.com', 'spamoff.de',
  'spamspot.com', 'spamthis.co.uk', 'spamthisplease.com',
  'spamtroll.net', 'speed.1s.fr', 'spoofmail.de',
  'stuffmail.de', 'super-auswahl.de', 'supermailer.jp', 'superrito.com',
  'suremail.info', 'svk.jp',
  'techemail.com', 'teintemail.com', 'temp-link.net', 'temp-mail.com',
  'temp-mail.de', 'temp-mail.io', 'temp-mail.org', 'temp-mail.ru',
  'temp-mail.top', 'tempe-mail.com', 'tempinbox.co.uk', 'tempinbox.com',
  'tempmail.de', 'tempmail.eu', 'tempmail.it', 'tempmail2.com',
  'tempomail.fr', 'temporamail.com', 'temporarioemail.com.br',
  'temporaryemail.net', 'temporaryemail.us', 'temporaryforwarding.com',
  'temporaryinbox.com', 'temporarymailaddress.com', 'tempsky.com',
  'tempr.email', 'tempymail.com', 'thanksnospam.info',
  'thc.st', 'theteastory.info', 'throwam.com',
  'throwaway.email', 'throwam.com', 'throwde.net',
  'tilien.com', 'tm.in.th', 'tmailinator.com',
  'toiea.com', 'toomail.biz', 'topranklist.de', 'tradermail.info',
  'trash-mail.at', 'trash-mail.com', 'trash-mail.de', 'trash-mail.ga',
  'trash-mail.io', 'trash-mail.ml', 'trash-mail.tk', 'trash-me.com',
  'trashcanmail.com', 'trashdevil.com', 'trashdevil.de', 'trashemail.de',
  'trashmail.at', 'trashmail.com', 'trashmail.de', 'trashmail.io',
  'trashmail.me', 'trashmail.net', 'trashmail.org', 'trashmail.se',
  'trashmailer.com', 'trashmails.com',
  'trbvm.com', 'trialmail.de', 'trillianpro.com',
  'trollproject.com', 'turual.com', 'twinmail.de',
  'tyldd.com',
  'uggsrock.com', 'uroid.com',
  'venompen.com', 'veryrealemail.com', 'viditag.com', 'viewcastmedia.com',
  'viralplays.com', 'vkcode.ru', 'vmailing.info', 'voidbay.com',
  'vomoto.com', 'vpn.st', 'vsimcard.com',
  'w3internet.co.uk', 'walala.org', 'wam.co.za',
  'webemail.me', 'webm4il.info', 'wegwerfadresse.de', 'wegwerfemail.com',
  'wegwerfemail.de', 'wegwerfemail.net', 'wegwerfemail.org',
  'wegwerfmail.de', 'wegwerfmail.info', 'wegwerfmail.net', 'wegwerfmail.org',
  'wetrainbayarea.com', 'wetrainbayarea.org', 'whyspam.me',
  'willhackforfood.biz', 'willselfdestruct.com',
  'winemaven.info', 'wmail.cf', 'writeme.com',
  'www.e4ward.com', 'wwwnew.eu',
  'xagloo.com', 'xemaps.com', 'xents.com', 'xmaily.com', 'xoxy.net',
  'xsmail.com', 'xww.ro',
  'yepmail.net', 'yert.ye.vc', 'yogamaven.com',
  'yopmail.com', 'yopmail.fr', 'yopmail.net', 'youmailr.com',
  'ypmail.webarnak.fr.eu.org', 'yuurok.com',
  'z1p.biz', 'za.com', 'zehnminuten.de', 'zehnminutenmail.de',
  'zetmail.com', 'zippymail.info', 'zoemail.com', 'zoemail.net',
  'zoemail.org', 'zomg.info',
])

export function validateEmail(email: string): EmailValidationResult {
  const trimmed = email.trim().toLowerCase()

  if (!EMAIL_REGEX.test(trimmed)) {
    return { valid: false, reason: 'invalid_format' }
  }

  const [localPart, domain] = trimmed.split('@')

  // Reject domains without a dot in the TLD part
  if (!domain || !domain.includes('.')) {
    return { valid: false, reason: 'invalid_domain' }
  }

  // Reject role-based prefixes
  if (ROLE_PREFIXES.has(localPart)) {
    return { valid: false, reason: 'role_address' }
  }

  // Reject disposable/throwaway domains
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { valid: false, reason: 'disposable_email' }
  }

  // Also check parent domain (e.g. sub.mailinator.com)
  const domainParts = domain.split('.')
  if (domainParts.length > 2) {
    const parentDomain = domainParts.slice(-2).join('.')
    if (DISPOSABLE_DOMAINS.has(parentDomain)) {
      return { valid: false, reason: 'disposable_email' }
    }
  }

  return { valid: true }
}

/** User-facing error messages keyed by reason */
export const VALIDATION_MESSAGES: Record<string, string> = {
  invalid_format: 'Please enter a valid email address.',
  role_address: 'Please use a personal or team business email, not a shared inbox.',
  disposable_email: 'Disposable or temporary email addresses are not accepted. Please use your business email.',
  invalid_domain: 'The email domain does not appear to be valid.',
}
