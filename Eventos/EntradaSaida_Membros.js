import {EmbedBuilder} from "discord.js"
export default (client) => {
   
           
    //Quando entrar algum membro
    client.on("guildMemberAdd", async member => {
    //Construir o Embed    
    const exampleEmbed = new EmbedBuilder()   
        .setColor(0x0BA684)
        .setTitle(':wave: Bem Vindo!')
        .setAuthor({ name: 'RuralHub', iconURL: 'https://cdn.discordapp.com/attachments/1197266244479483914/1233494915619491841/Folha-Grande-sf.png?ex=6631ea69&is=663098e9&hm=e64d3e6df2b8cd0c784d010a4c3fe8197cca01457bf6649530fa3e8a437f052c&', url: 'https://ruralhub.com.br/' })
        .setDescription(`Seja bem vindo(a) ${member} a RuralHub!\n Obrigado por fazer parte de nossa equipe, você é o ${member.guild.memberCount - 1}º membro`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true}))
    //Final da construção Ebed

        let canal = "1067511474211274824"
        if (!canal) return;

        try {
            member.guild.channels.cache.get(canal).send({ embeds: [exampleEmbed], content: `${member}` }) //content serve para mencionar o membro
        } catch (error) {
            console.error("Erro ao enviar mensagem de boas vindas: " + error)
        }
    })

    

    // Quando sair algum membro
    client.on("guildMemberRemove", async member => {
    //Construir o Embed    
    const exampleEmbed = new EmbedBuilder()   
        .setColor(0x0BA684)
        .setTitle(':wave: Tchau!')
        .setAuthor({ name: 'RuralHub', iconURL: 'https://cdn.discordapp.com/attachments/1197266244479483914/1233494915619491841/Folha-Grande-sf.png?ex=6631ea69&is=663098e9&hm=e64d3e6df2b8cd0c784d010a4c3fe8197cca01457bf6649530fa3e8a437f052c&', url: 'https://ruralhub.com.br/' })
        .setDescription(`${member} foi de base! Sobraram ${member.guild.memberCount - 1} sobreviventes.`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true}))
    //Final da construção Ebed

        let canal = "1067511474211274824"
        if (!canal) return;

        try {
            member.guild.channels.cache.get(canal).send({ embeds: [exampleEmbed]})
        } catch (error) {
            console.error("Erro ao enviar mensagem de despedida: " + error)
        }
    });
}