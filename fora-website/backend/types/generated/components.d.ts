import type { Schema, Struct } from '@strapi/strapi';

export interface ForumAgendaItem extends Struct.ComponentSchema {
  collectionName: 'components_forum_agenda_items';
  info: {
    description: '\u039C\u03AF\u03B1 \u03B3\u03C1\u03B1\u03BC\u03BC\u03AE \u03C4\u03BF\u03C5 \u03C0\u03C1\u03BF\u03B3\u03C1\u03AC\u03BC\u03BC\u03B1\u03C4\u03BF\u03C2: \u03BF\u03BC\u03B9\u03BB\u03AF\u03B1, \u03B4\u03B9\u03AC\u03BB\u03B5\u03B9\u03BC\u03BC\u03B1, \u03AD\u03BD\u03B1\u03C1\u03BE\u03B7, \u03C3\u03C4\u03C1\u03BF\u03B3\u03B3\u03C5\u03BB\u03CC \u03C4\u03C1\u03B1\u03C0\u03AD\u03B6\u03B9 \u03BA.\u03BB\u03C0.';
    displayName: '\u03A3\u03C4\u03BF\u03B9\u03C7\u03B5\u03AF\u03BF \u03A0\u03C1\u03BF\u03B3\u03C1\u03AC\u03BC\u03BC\u03B1\u03C4\u03BF\u03C2';
  };
  attributes: {
    idiotita: Schema.Attribute.String;
    omilitis: Schema.Attribute.String;
    ora: Schema.Attribute.String;
    titlos: Schema.Attribute.String & Schema.Attribute.Required;
    typos: Schema.Attribute.Enumeration<
      [
        '\u039F\u03BC\u03B9\u03BB\u03AF\u03B1',
        '\u039A\u03B5\u03BD\u03C4\u03C1\u03B9\u03BA\u03AE \u039F\u03BC\u03B9\u03BB\u03AF\u03B1',
        '\u0388\u03BD\u03B1\u03C1\u03BE\u03B7',
        '\u03A7\u03B1\u03B9\u03C1\u03B5\u03C4\u03B9\u03C3\u03BC\u03BF\u03AF',
        '\u0394\u03B9\u03AC\u03BB\u03B5\u03B9\u03BC\u03BC\u03B1',
        '\u03A3\u03C4\u03C1\u03BF\u03B3\u03B3\u03C5\u03BB\u03CC \u03A4\u03C1\u03B1\u03C0\u03AD\u03B6\u03B9',
        '\u039B\u03AE\u03BE\u03B7',
      ]
    > &
      Schema.Attribute.DefaultTo<'\u039F\u03BC\u03B9\u03BB\u03AF\u03B1'>;
  };
}

export interface ForumAgendaSession extends Struct.ComponentSchema {
  collectionName: 'components_forum_agenda_sessions';
  info: {
    description: '\u039C\u03AF\u03B1 \u03B5\u03BD\u03CC\u03C4\u03B7\u03C4\u03B1 \u03C4\u03BF\u03C5 \u03C0\u03C1\u03BF\u03B3\u03C1\u03AC\u03BC\u03BC\u03B1\u03C4\u03BF\u03C2: \u03C4\u03AF\u03C4\u03BB\u03BF\u03C2, \u03C7\u03C1\u03BF\u03BD\u03B9\u03BA\u03CC \u03BC\u03C0\u03BB\u03BF\u03BA, \u03C3\u03C5\u03BD\u03C4\u03BF\u03BD\u03B9\u03C3\u03C4\u03AE\u03C2 \u03BA\u03B1\u03B9 \u03BF\u03B9 \u03BF\u03BC\u03B9\u03BB\u03AF\u03B5\u03C2 \u03C4\u03B7\u03C2.';
    displayName: '\u0395\u03BD\u03CC\u03C4\u03B7\u03C4\u03B1 \u03A0\u03C1\u03BF\u03B3\u03C1\u03AC\u03BC\u03BC\u03B1\u03C4\u03BF\u03C2';
  };
  attributes: {
    stoixeia: Schema.Attribute.Component<'forum.agenda-item', true>;
    syntonistis: Schema.Attribute.String;
    titlos: Schema.Attribute.String & Schema.Attribute.Required;
    xronikoBlok: Schema.Attribute.String;
  };
}

export interface ForumSpeaker extends Struct.ComponentSchema {
  collectionName: 'components_forum_speakers';
  info: {
    description: '\u0388\u03BD\u03B1\u03C2 \u03BF\u03BC\u03B9\u03BB\u03B7\u03C4\u03AE\u03C2 \u03C4\u03BF\u03C5 Forum: \u03C6\u03C9\u03C4\u03BF\u03B3\u03C1\u03B1\u03C6\u03AF\u03B1, \u03CC\u03BD\u03BF\u03BC\u03B1, \u03B9\u03B4\u03B9\u03CC\u03C4\u03B7\u03C4\u03B1 \u03BA\u03B1\u03B9 \u03C3\u03CD\u03BD\u03C4\u03BF\u03BC\u03BF \u03B2\u03B9\u03BF\u03B3\u03C1\u03B1\u03C6\u03B9\u03BA\u03CC.';
    displayName: '\u039F\u03BC\u03B9\u03BB\u03B7\u03C4\u03AE\u03C2';
  };
  attributes: {
    fotografia: Schema.Attribute.Media<'images'>;
    idiotita: Schema.Attribute.Text;
    onoma: Schema.Attribute.String & Schema.Attribute.Required;
    viografiko: Schema.Attribute.RichText;
  };
}

export interface ForumSponsor extends Struct.ComponentSchema {
  collectionName: 'components_forum_sponsors';
  info: {
    description: '\u0388\u03BD\u03B1 \u03BB\u03BF\u03B3\u03CC\u03C4\u03C5\u03C0\u03BF \u03C7\u03BF\u03C1\u03B7\u03B3\u03BF\u03CD \u03AE \u03C3\u03C5\u03BD\u03B5\u03C1\u03B3\u03AC\u03C4\u03B7. \u03A4\u03BF \u03CC\u03BD\u03BF\u03BC\u03B1 \u03BA\u03B1\u03B9 \u03BF \u03C3\u03CD\u03BD\u03B4\u03B5\u03C3\u03BC\u03BF\u03C2 \u03B5\u03AF\u03BD\u03B1\u03B9 \u03C0\u03C1\u03BF\u03B1\u03B9\u03C1\u03B5\u03C4\u03B9\u03BA\u03AC.';
    displayName: '\u03A7\u03BF\u03C1\u03B7\u03B3\u03CC\u03C2 / \u03A3\u03C5\u03BD\u03B5\u03C1\u03B3\u03AC\u03C4\u03B7\u03C2';
  };
  attributes: {
    istoselida: Schema.Attribute.String;
    logotypo: Schema.Attribute.Media<'images'>;
    onoma: Schema.Attribute.String;
  };
}

export interface ForumSponsorGroup extends Struct.ComponentSchema {
  collectionName: 'components_forum_sponsor_groups';
  info: {
    description: '\u039C\u03B9\u03B1 \u03BA\u03B1\u03C4\u03B7\u03B3\u03BF\u03C1\u03AF\u03B1 \u03C3\u03C5\u03BD\u03B5\u03C1\u03B3\u03B1\u03C4\u03CE\u03BD (\u03C0.\u03C7. \u03A7\u03C1\u03C5\u03C3\u03CC\u03C2 \u03A7\u03BF\u03C1\u03B7\u03B3\u03CC\u03C2, \u03A3\u03C5\u03BD\u03B4\u03B9\u03BF\u03C1\u03B3\u03B1\u03BD\u03C9\u03C4\u03AD\u03C2) \u03BA\u03B1\u03B9 \u03C4\u03B1 \u03BB\u03BF\u03B3\u03CC\u03C4\u03C5\u03C0\u03AC \u03C4\u03B7\u03C2.';
    displayName: '\u039F\u03BC\u03AC\u03B4\u03B1 \u03A3\u03C5\u03BD\u03B5\u03C1\u03B3\u03B1\u03C4\u03CE\u03BD';
  };
  attributes: {
    katigoria: Schema.Attribute.String & Schema.Attribute.Required;
    logotypa: Schema.Attribute.Component<'forum.sponsor', true>;
  };
}

export interface ForumStat extends Struct.ComponentSchema {
  collectionName: 'components_forum_stats';
  info: {
    description: '\u0388\u03BD\u03B1\u03C2 \u03B1\u03C1\u03B9\u03B8\u03BC\u03CC\u03C2/\u03C3\u03C4\u03B1\u03C4\u03B9\u03C3\u03C4\u03B9\u03BA\u03CC \u03C4\u03B7\u03C2 \u03B4\u03B9\u03BF\u03C1\u03B3\u03AC\u03BD\u03C9\u03C3\u03B7\u03C2, \u03C0.\u03C7. \u00AB400+ \u03A3\u03C5\u03BC\u03BC\u03B5\u03C4\u03AD\u03C7\u03BF\u03BD\u03C4\u03B5\u03C2\u00BB. \u0394\u03B9\u03B1\u03C6\u03BF\u03C1\u03B5\u03C4\u03B9\u03BA\u03CC\u03C2 \u03B1\u03BD\u03AC Forum.';
    displayName: '\u0391\u03C1\u03B9\u03B8\u03BC\u03CC\u03C2 (\u03A3\u03C4\u03B1\u03C4\u03B9\u03C3\u03C4\u03B9\u03BA\u03CC)';
  };
  attributes: {
    arithmos: Schema.Attribute.String & Schema.Attribute.Required;
    perigrafi: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ForumThematicSection extends Struct.ComponentSchema {
  collectionName: 'components_forum_thematic_sections';
  info: {
    description: '\u039C\u03AF\u03B1 \u03B8\u03B5\u03BC\u03B1\u03C4\u03B9\u03BA\u03AE \u03B5\u03BD\u03CC\u03C4\u03B7\u03C4\u03B1 \u03C4\u03BF\u03C5 Forum: \u03C4\u03AF\u03C4\u03BB\u03BF\u03C2 \u03BA\u03B1\u03B9 \u03C0\u03B5\u03C1\u03B9\u03B3\u03C1\u03B1\u03C6\u03AE.';
    displayName: '\u0398\u03B5\u03BC\u03B1\u03C4\u03B9\u03BA\u03AE \u0395\u03BD\u03CC\u03C4\u03B7\u03C4\u03B1';
  };
  attributes: {
    perigrafi: Schema.Attribute.Text;
    titlos: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ForumVideo extends Struct.ComponentSchema {
  collectionName: 'components_forum_videos';
  info: {
    description: '\u0388\u03BD\u03B1 \u03B2\u03AF\u03BD\u03C4\u03B5\u03BF YouTube. \u0395\u03C0\u03B9\u03BA\u03BF\u03BB\u03BB\u03AE\u03C3\u03C4\u03B5 \u03C4\u03BF\u03BD \u03C3\u03CD\u03BD\u03B4\u03B5\u03C3\u03BC\u03BF \u03C4\u03BF\u03C5 YouTube.';
    displayName: '\u0392\u03AF\u03BD\u03C4\u03B5\u03BF';
  };
  attributes: {
    syndesmosYoutube: Schema.Attribute.String & Schema.Attribute.Required;
    titlos: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'forum.agenda-item': ForumAgendaItem;
      'forum.agenda-session': ForumAgendaSession;
      'forum.speaker': ForumSpeaker;
      'forum.sponsor': ForumSponsor;
      'forum.sponsor-group': ForumSponsorGroup;
      'forum.stat': ForumStat;
      'forum.thematic-section': ForumThematicSection;
      'forum.video': ForumVideo;
    }
  }
}
