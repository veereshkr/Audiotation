export default {
  items: [
    
    {
      name: 'Reviews',
      url: '/reviews',
      icon: 'icon-emotsmile',
      badge: {
        variant: 'info',
        text: ''
      }
    },

    {
      name: 'Stats',
      url: '/sentiments-sentences',
      icon: 'icon-chart'
    },

    {
      name: 'Feedback',
      url: '/icons',
      icon: 'icon-speech',
      children: [
        {
          name: 'Feedback Overview',
          url: '/feedbacks',
          icon: 'fa fa-snowflake-o fa-lg mt-4',
          badge: {
            variant: 'secondary',
            text: ''
          }
        }
      ]
    },

    {
      divider: true
    }

  ]
};
