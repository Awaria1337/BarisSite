import { PageHeader, wrap } from "@/components/blocks";
import { address, contact, site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "KVKK Aydınlatma Metni",
  description:
    "Barış Alaş Kuaför Salonu kişisel verilerin korunması aydınlatma metni: web sitesi, WhatsApp ve telefon iletişiminde işlenen veriler ve haklarınız.",
  path: "/kvkk/",
});

// TODO(confirm): have the owner (veri sorumlusu) review this text; not legal advice.
export default function KvkkPage() {
  return (
    <>
      <PageHeader
        crumbs={[
          { name: "Ana sayfa", path: "/" },
          { name: "KVKK", path: "/kvkk/" },
        ]}
        title="Aydınlatma metni"
      />
      <article className={cn(wrap, "max-w-3xl space-y-6 pb-24 text-lg [&_h2]:mt-12 [&_h2]:text-3xl")}>
        <p>
          6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında veri sorumlusu sıfatıyla {site.name} (
          {address.neighborhood} {address.street}, {address.landmark}, {address.postalCode} {address.city}) olarak
          kişisel verilerinizi nasıl işlediğimizi açıklıyoruz.
        </p>
        <h2>Bu web sitesi</h2>
        <p>
          Web sitemizde form, üyelik, çerez tabanlı takip ya da reklam aracı kullanmıyoruz. Siteyi barındıran altyapı
          sağlayıcısı, güvenlik ve hizmetin sürekliliği için IP adresi ve tarayıcı bilgisi gibi teknik kayıtları sınırlı
          süre tutabilir.
        </p>
        <h2>WhatsApp ve telefon</h2>
        <p>
          WhatsApp ya da telefonla bize ulaştığınızda adınız, telefon numaranız, mesajlarınız ve gönderdiğiniz saç
          fotoğrafları; randevu oluşturmak, size bilgi vermek ve hizmeti sunmak amacıyla, KVKK m.5/2-c (sözleşmenin
          kurulması) ve m.5/2-f (meşru menfaat) hukuki sebeplerine dayanarak işlenir. Bu veriler üçüncü kişilerle
          paylaşılmaz; WhatsApp hizmeti Meta tarafından sağlanır.
        </p>
        <h2>Saklama süresi</h2>
        {/* TODO(confirm): retention period is the owner's decision. */}
        <p>
          Randevu ve iletişim için paylaştığınız bilgileri, işlem amacı ortadan kalktıktan sonra makul bir süre içinde
          ve en geç bir yıl sonunda siliyoruz. Yasal saklama yükümlülüğü olan kayıtları (örneğin faturalar) ilgili
          mevzuatın öngördüğü süre boyunca saklıyoruz.
        </p>
        <h2>Yurt dışına aktarım</h2>
        <p>
          Web sitemiz Cloudflare altyapısında barındırılır; WhatsApp hizmeti Meta tarafından sağlanır. Bu hizmetlerin
          sunucuları yurt dışında bulunabileceğinden, bu kanallarla ilettiğiniz veriler KVKK m.9 kapsamında yurt dışına
          aktarılabilir. Bu kanalları kullanmak istemezseniz bize telefonla ya da salonumuza gelerek ulaşabilirsiniz.
        </p>
        <h2>Fotoğraflar</h2>
        <p>
          Yüzünüzün göründüğü fotoğrafları yalnızca açık rızanızla web sitemizde ve sosyal medyada paylaşırız. Rızanızı
          dilediğiniz zaman geri alabilirsiniz.
        </p>
        <h2>Haklarınız</h2>
        <p>
          KVKK m.11 uyarınca verilerinizin işlenip işlenmediğini öğrenme, düzeltilmesini ya da silinmesini isteme ve
          itiraz etme haklarına sahipsiniz. Başvurularınızı Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında
          Tebliğ&apos;e uygun şekilde, yukarıdaki adresimize yazılı olarak iletebilirsiniz. Sorularınız için{" "}
          <a href={`tel:${contact.phoneE164}`} className="underline underline-offset-4">
            {contact.phoneDisplay}
          </a>{" "}
          numarasından bize ulaşabilirsiniz.
        </p>
      </article>
    </>
  );
}
