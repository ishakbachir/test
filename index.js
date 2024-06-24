const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  PermissionsBitField,
  ButtonBuilder,
  ButtonStyle,
  userMention,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ModalSubmitInteraction,
  permissionOverwrites
} = require("discord.js");

const client = new Client({
  intents: 131071,
});

//================ املا هذه البيانات ============================//

const prefix = "+"; // البريفكس
const owner = ""; // ايدي الاونر الي يقدر يرسل زر التحذير
const staffid = ""; // ايدي رتبة الاداريين
const warnsch = ""; //ايدي روم التحذيرات
const warn25 = ""; //ايدي رتبة التحذير 1
const warn50 = ""; // ايدي رتبة التحذير 2
const warn100 = ""; // ايدي رتبة التحذير 3
const line = ""; // رابط الخط

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!
      Index.js  ✅
      `);
  client.user.setStatus("online");
});

//====================================== جميع الاكواد هنا ===================================================//

client.on('messageCreate', (message) => {
  if (message.content == prefix + "sendp") {
    if (message.author.id !== owner) return;
    if (message.author.bot) return;
    const embed = new EmbedBuilder()
      .setTitle('قم بالضغط على الزر لتحذير بائع')
      .setColor('DarkButNotBlack');

    const btn = new ButtonBuilder()
      .setCustomId('warnseller')
      .setLabel('نحذير')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('⚠️');
    const row = new ActionRowBuilder().addComponents(btn);

    message.delete();
    message.channel.send({ embeds: [embed], components: [row] });
  }
})

client.on('interactionCreate', async (interaction) => {
  if (interaction.customId == "warnseller") {
    if (!interaction.member.roles.cache.has(staffid)) return interaction.reply({ content: 'عذرا ليس لديك صلاحية', ephemral: true })
    const modal = new ModalBuilder()
      .setTitle('تحذير بائع')
      .setCustomId('warnmodal');
    const qu1 = new TextInputBuilder()
      .setCustomId('qu1')
      .setLabel('ايدي البائع')
      .setPlaceholder('ضع ايدي البائع')
      .setStyle(TextInputStyle.Short);
    const qu2 = new TextInputBuilder()
      .setCustomId('qu2')
      .setLabel('السبب')
      .setPlaceholder('ضع سبب التحذير')
      .setStyle(TextInputStyle.Paragraph)
      .setMaxLength(150);
    const qu3 = new TextInputBuilder()
      .setCustomId('qu3')
      .setLabel('الدليل')
      .setPlaceholder('ضع رابط صورة الدليل')
      .setStyle(TextInputStyle.Short);
    const row1 = new ActionRowBuilder().addComponents(qu1)
    const row2 = new ActionRowBuilder().addComponents(qu2)
    const row3 = new ActionRowBuilder().addComponents(qu3)
    modal.addComponents(row1, row2, row3);
    interaction.showModal(modal)
  } else if (interaction.customId == "warnmodal") {
    if (!interaction.member.roles.cache.has(staffid)) return interaction.reply({ content: 'عذرا ليس لديك صلاحية', ephemeral: true });

    const v1 = interaction.fields.getTextInputValue('qu1') // seller
    const v2 = interaction.fields.getTextInputValue('qu2') // reason
    const v3 = interaction.fields.getTextInputValue('qu3') // image

    if (isNaN(v1)) return interaction.reply({ content: 'عذرا ايدي البائع غلط', ephemeral: true });
    if (!v3.startsWith('https') || !v3.startsWith('http')) return interaction.reply({ content: 'عذرا تاكد من رابط الخط', ephemeral: true });
    const embed25 = new EmbedBuilder()
      .setTitle('تحذير جديد')
      .setDescription(`**الاداري : <@${interaction.user.id}> \n السبب : ${v2} \n التحذير : 25%**`)
      //.setImage(`${v3}`)
      .setColor('#11806a');

    const embed50 = new EmbedBuilder()
      .setTitle('تحذير جديد')
      .setDescription(`**الاداري : <@${interaction.user.id}> \n السبب : ${v2} \n التحذير : 50%**`)
      //.setImage(`${v3}`)
      .setColor('#11806a');

    const embed100 = new EmbedBuilder()
      .setTitle('تحذير جديد')
      .setDescription(`**الاداري : <@${interaction.user.id}> \n السبب : ${v2} \n التحذير : 100%**`)
      //.setImage(`${v3}`)
      .setColor('#11806a');

    const embedrem = new EmbedBuilder()
      .setTitle('تحذير جديد')
      .setDescription(`**الاداري : <@${interaction.user.id}> \n السبب : ${v2} \n التحذير : سحب رتبة**`)
      //.setImage(`${v3}`)
      .setColor('#11806a');
    const channel = client.channels.cache.get(warnsch)
    const seller = interaction.guild.members.cache.get(v1);
    if (!channel) return interaction.reply({ content: 'روم التحذيرات غير موجودة', ephemeral: true });
    if (!seller) return interaction.reply({ content: 'عذرا البائع غير موجود', ephemral: true });
    // اذا البائع لديه تحذير 25 بالفعل
    if (seller.roles.cache.has(warn25)) {
      await seller.roles.add(warn50);
      if (seller.roles.cache.has(warn25)) {
        seller.roles.remove(warn25);
      }
      await seller.send(`**لقد تم تحذيرك بسبب :** ${v2} \n __التحذير __: 50% \n *لحذف التحذير يرجى فتح تكت دعم فني*`).catch(() => { })
      await channel.send({ content : `البائع : <@${v1}>` ,files : [v3],embeds: [embed50] }).then(async () => {
        await channel.send(line);
      })
      interaction.reply({ content: `تم تحذيره بنجاح`, ephemeral: true });
      return;
    }

    // اذا البائع لديه تحذير 50 بالفعل
    if (seller.roles.cache.has(warn50)) {
      await seller.roles.add(warn100);
      if (seller.roles.cache.has(warn25)) {
        seller.roles.remove(warn25);
      } else if (seller.roles.cache.has(warn50)) {
        seller.roles.remove(warn50);
      }
      await seller.send(`**لقد تم تحذيرك بسبب :** ${v2} \n __التحذير __: 100% \n *لحذف التحذير يرجى فتح تكت دعم فني*`).catch(() => { })
      await channel.send({ content : `البائع : <@${v1}>` ,files : [v3],embeds: [embed100] }).then(async () => {
        await channel.send(line);
      })
      interaction.reply({ content: `تم تحذيره بنجاح`, ephemeral: true });
      return;
    }
    // اذا البائع لديه تحذير 100 بالفعل
    if (seller.roles.cache.has(warn100)) {
      if (seller.roles.cache.has(warn25)) {
        seller.roles.remove(warn25);
      } else if (seller.roles.cache.has(warn50)) {
        seller.roles.remove(warn50);
      } else if (seller.roles.cache.has(warn100)) {
        seller.roles.remove(warn100);
      }
      await seller.send(`**لقد تم تحذيرك بسبب :** ${v2} \n __التحذير __: سحب رتبة`).catch(() => { })
      await channel.send({ content : `البائع : <@${v1}>` ,files : [v3],embeds: [embedrem] }).then(async () => {
        await channel.send(line);
      })
      interaction.reply({ content: `تم تحذيره بنجاح يرجى سحب رتبة البائع منه`, ephemeral: true });
      return;
    }
    else {
      await seller.roles.add(warn25);
      await seller.send(`**لقد تم تحذيرك بسبب :** ${v2} \n __التحذير __: 25% \n *لحذف التحذير يرجى فتح تكت دعم فني*`).catch(() => { })
      await channel.send({ content : `البائع : <@${v1}>` ,files : [v3], embeds: [embed25] }).then(async () => {
        await channel.send(line);
      })
      interaction.reply({ content: `تم تحذيره بنجاح`, ephemeral: true });
      return;
    }
  }
})

//nodejs-events
process.on("unhandledRejection", (e) => {
  return console.log(e);
});
process.on("uncaughtException", (e) => {
  return console.log(e);
});
process.on("uncaughtExceptionMonitor", (e) => {
  return console.log(e);
});

//===================================== جميع الاكواد هنا ====================================================//
client.login(process.env.general_p); // توكن البوت 
